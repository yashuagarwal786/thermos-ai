from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Any

from .config import settings
from .engine import RecommendationEngine

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RecommendationRequest(BaseModel):
    city: str = Field(..., description="Target urban area name")
    concrete_percent: float = Field(..., ge=0.0, le=100.0, description="Percentage of impermeable concrete surfaces")
    green_cover_percent: float = Field(..., ge=0.0, le=100.0, description="Percentage of existing green/vegetation canopy")
    population_density: float = Field(..., ge=0.0, description="Population density per square kilometer")
    base_temp: float = Field(..., ge=10.0, le=60.0, description="Current hot-spot average temperature in Celsius")
    budget: str = Field("medium", description="Mitigation budget scope: low, medium, or high")

@app.get("/health")
def health():
    return {"status": "healthy", "service": "recommendation-service"}

@app.post("/recommend")
def get_cooling_recommendations(req: RecommendationRequest):
    """
    Evaluates urban metrics and triggers customized heat mitigation strategy vectors.
    """
    try:
        recommendations = RecommendationEngine.generate_recommendations(
            city=req.city,
            concrete_percent=req.concrete_percent,
            green_cover_percent=req.green_cover_percent,
            population_density=req.population_density,
            base_temp=req.base_temp,
            budget=req.budget
        )
        return recommendations
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Recommendation pipeline failed: {str(e)}"
        )
