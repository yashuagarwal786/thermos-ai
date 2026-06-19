from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Any

from .config import settings
from .simulator import ClimateSimulator

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SimulationRequest(BaseModel):
    base_temp: float = Field(32.0, ge=10.0, le=60.0, description="Baseline environmental temperature in Celsius")
    green_cover_delta: float = Field(0.0, ge=0.0, le=100.0, description="Percentage point increase in tree/vegetation canopy")
    water_bodies_delta: float = Field(0.0, ge=0.0, le=100.0, description="Percentage point increase in urban water body coverage")
    reflective_roofs_delta: float = Field(0.0, ge=0.0, le=100.0, description="Percentage point increase in high-albedo cool roofs")
    concrete_reduction_delta: float = Field(0.0, ge=0.0, le=100.0, description="Percentage point decrease in dark impermeable concrete/pavements")

@app.get("/health")
def health():
    return {"status": "healthy", "service": "simulation-service"}

@app.post("/simulate")
def run_simulation(req: SimulationRequest):
    """
    Executes climate cooling simulation based on input land use changes.
    """
    try:
        results = ClimateSimulator.simulate(
            base_temp=req.base_temp,
            green_cover_delta=req.green_cover_delta,
            water_bodies_delta=req.water_bodies_delta,
            reflective_roofs_delta=req.reflective_roofs_delta,
            concrete_reduction_delta=req.concrete_reduction_delta
        )
        return results
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Simulation error: {str(e)}"
        )
