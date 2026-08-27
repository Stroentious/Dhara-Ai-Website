from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app import schemas
from app.database import get_db
from app.pipelines.weather_decision_pipeline import WeatherDecisionPipeline

router = APIRouter(prefix="/weather", tags=["weather"])

@router.get("", response_model=schemas.WeatherResponse)
async def get_weather(
    lat: float = 0.0,
    lon: float = 0.0,
    location: Optional[str] = "Karnal, Haryana",
    field_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Current Weather & Forecast endpoint:
    Returns normalized weather data, caching results for 10 minutes.
    """
    decision = await WeatherDecisionPipeline.fetch_weather(
        location=location or "Karnal, Haryana",
        lat=lat if lat != 0.0 else None,
        lon=lon if lon != 0.0 else None,
        db=db,
        field_id=field_id
    )
    
    return schemas.WeatherResponse(
        temperature=decision.temperature_celsius,
        humidity=decision.humidity_percent,
        rain_probability=decision.rain_probability_percent,
        wind_speed=decision.wind_speed_kmh,
        description=decision.condition,
        forecast=decision.forecast,
        source=decision.source
    )

@router.get("/decision", response_model=schemas.WeatherDecisionResponse)
async def get_weather_decision(
    location: Optional[str] = "Karnal, Haryana",
    field_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Weather Decision Endpoint:
    Provides agricultural advisories for irrigation timing, foliar spraying, and thermal stress.
    """
    return await WeatherDecisionPipeline.fetch_weather(
        location=location or "Karnal, Haryana",
        db=db,
        field_id=field_id
    )
