from fastapi import FastAPI, UploadFile, File, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
import uuid
from typing import List, Dict, Any

from .config import settings
from .processing import ThermalProcessor

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, lock down to dashboard domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simulated in-memory database of metadata records (to be linked to PostgreSQL in Phase 4)
metadata_store: Dict[str, Dict[str, Any]] = {}

@app.get("/health")
def health():
    return {"status": "healthy", "service": "satellite-service"}

@app.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_satellite_image(file: UploadFile = File(...)):
    """
    Accepts satellite/thermal image uploads, saves to disc, and executes processing.
    """
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format. Supported extensions: {settings.ALLOWED_EXTENSIONS}"
        )

    file_id = str(uuid.uuid4())
    save_filename = f"{file_id}{file_ext}"
    dest_path = os.path.join(settings.UPLOAD_DIR, save_filename)

    try:
        with open(dest_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to write image file: {str(e)}"
        )

    try:
        # Perform image preprocessing and temperature parsing
        analysis_result = ThermalProcessor.process_image(dest_path)
        analysis_result["id"] = file_id
        analysis_result["file_path"] = dest_path

        # Save metadata to temporary store
        metadata_store[file_id] = analysis_result

        return {
            "success": True,
            "message": "Satellite image processed successfully",
            "data": analysis_result
        }
    except Exception as e:
        # Cleanup file if processing failed
        if os.path.exists(dest_path):
            os.remove(dest_path)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Thermal parsing failed: {str(e)}"
        )

@app.get("/images", response_model=List[Dict[str, Any]])
def list_processed_images():
    """
    Returns lists of previously uploaded and analyzed raster indices.
    """
    return list(metadata_store.values())

@app.get("/images/{image_id}", response_model=Dict[str, Any])
def get_image_details(image_id: str):
    """
    Retrieves deep metrics for a specific raster asset.
    """
    if image_id not in metadata_store:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Satellite asset metadata record not found"
        )
    return metadata_store[image_id]
