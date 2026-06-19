from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any

from .config import settings
from .forecaster import TemperatureForecaster

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "healthy", "service": "prediction-service"}

@app.get("/forecast")
def get_temperature_forecast(
    city: str = Query(..., description="Target city for climate prediction"),
    base_temp: float = Query(28.0, description="Base temperature calibration"),
    horizon: str = Query("7d", description="Forecast horizon: 7d, 30d, 6m, 1y")
):
    """
    Computes climate warming forecast vectors for the specified city and horizon.
    """
    horizon_days_map = {
        "7d": 7,
        "30d": 30,
        "6m": 180,
        "1y": 365
    }
    
    if horizon not in horizon_days_map:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid horizon. Options are: {list(horizon_days_map.keys())}"
        )
        
    days = horizon_days_map[horizon]
    try:
        forecast_data = TemperatureForecaster.forecast(city, base_temp, days)
        return forecast_data
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Forecasting computation failed: {str(e)}"
        )
