from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta

from app import models, schemas
from app.database import get_db
from app.auth import get_current_active_user
from app.pipelines.soil_decision_pipeline import SoilDecisionPipeline
from app.pipelines.weather_decision_pipeline import WeatherDecisionPipeline
from app.mock_data import generate_mock_history

router = APIRouter(prefix="/fields", tags=["fields"])

def verify_field_ownership(field_id: int, current_user: models.User, db: Session) -> models.Field:
    field = db.query(models.Field).filter(
        models.Field.id == field_id,
        models.Field.owner_id == current_user.id
    ).first()
    if not field:
        raise HTTPException(status_code=404, detail="Field not found")
    return field

@router.get("", response_model=List[schemas.FieldResponse])
def get_fields(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    fields = db.query(models.Field).filter(models.Field.owner_id == current_user.id).all()
    return fields

@router.post("", response_model=schemas.FieldResponse)
def create_field(
    field_in: schemas.FieldCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    new_field = models.Field(
        **field_in.model_dump(),
        owner_id=current_user.id
    )
    db.add(new_field)
    db.commit()
    db.refresh(new_field)
    return new_field

@router.get("/{field_id}/status", response_model=schemas.FieldStatusResponse)
async def get_field_status(
    field_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """
    Real-Time Field Agronomic Status:
    Combines live 7-in-1 sensor readings, soil health score, moisture deficit,
    NPK nutrient balance, weather forecast, and active recommendations.
    """
    field = verify_field_ownership(field_id, current_user, db)

    latest_reading = db.query(models.SensorReading).filter(
        models.SensorReading.field_id == field_id
    ).order_by(models.SensorReading.timestamp.desc()).first()

    # Weather fetch
    weather_resp = await WeatherDecisionPipeline.fetch_weather(
        location=field.location or "Karnal, Haryana",
        db=db,
        field_id=field_id
    )

    # Soil + Decision calculations
    soil_health = SoilDecisionPipeline.analyze_soil_health(latest_reading, field.crop_type)
    water_req = SoilDecisionPipeline.calculate_water_requirement(
        reading=latest_reading,
        field=field,
        rain_probability_percent=weather_resp.rain_probability_percent,
        precipitation_mm=weather_resp.precipitation_expected_mm
    )
    fert_req = SoilDecisionPipeline.calculate_fertilizer_requirement(latest_reading, field)

    # Active alerts & recommendations
    active_alerts = db.query(models.Alert).filter(
        models.Alert.field_id == field_id,
        models.Alert.is_resolved == False
    ).order_by(models.Alert.created_at.desc()).limit(5).all()

    active_recs = db.query(models.Recommendation).filter(
        models.Recommendation.field_id == field_id,
        models.Recommendation.is_applied == False
    ).order_by(models.Recommendation.created_at.desc()).limit(5).all()

    # If no recommendations exist yet, generate them on the fly
    if not active_recs:
        active_recs = SoilDecisionPipeline.evaluate_and_generate_recommendations(
            db=db,
            field_id=field_id,
            rain_probability_percent=weather_resp.rain_probability_percent,
            precipitation_mm=weather_resp.precipitation_expected_mm
        )

    reading_schema = None
    if latest_reading:
        reading_schema = schemas.SensorReadingResponse.model_validate(latest_reading)

    return schemas.FieldStatusResponse(
        field_id=field.id,
        field_name=field.name,
        crop_type=field.crop_type or "Wheat",
        area_hectares=field.area_hectares or 2.5,
        location=field.location or "Karnal, Haryana",
        soil_type=field.soil_type or "Alluvial Loam",
        last_sensor_reading=reading_schema,
        soil_health=soil_health,
        water_requirement=water_req,
        fertilizer_requirement=fert_req,
        weather_summary={
            "temperature_celsius": weather_resp.temperature_celsius,
            "condition": weather_resp.condition,
            "rain_probability_percent": weather_resp.rain_probability_percent,
            "irrigation_advisory": weather_resp.irrigation_advisory,
            "spray_advisory": weather_resp.fertilizer_spray_advisory
        },
        active_alerts=[schemas.AlertResponse.model_validate(a) for a in active_alerts],
        active_recommendations=[schemas.RecommendationResponse.model_validate(r) for r in active_recs]
    )

@router.get("/{field_id}/history")
def get_field_history(
    field_id: int,
    days: int = Query(7, ge=1, le=90),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """
    Historical Trend Analytics:
    Provides timestamped sensor readings and aggregated statistics for the field.
    """
    field = verify_field_ownership(field_id, current_user, db)
    since_date = datetime.utcnow() - timedelta(days=days)

    readings = db.query(models.SensorReading).filter(
        models.SensorReading.field_id == field_id,
        models.SensorReading.timestamp >= since_date
    ).order_by(models.SensorReading.timestamp.asc()).all()

    if not readings:
        mock_readings = generate_mock_history(field_id, days=days)
        return {
            "field_id": field_id,
            "field_name": field.name,
            "period_days": days,
            "readings_count": len(mock_readings),
            "readings": mock_readings,
            "analytics": {
                "avg_moisture": 60.5,
                "avg_nitrogen": 54.0,
                "avg_phosphorus": 28.0,
                "avg_potassium": 250.0,
                "avg_ph": 6.8,
                "moisture_trend": "Stable"
            }
        }

    # Compute Statistical Averages
    valid_moistures = [r.soil_moisture for r in readings if r.soil_moisture is not None]
    valid_nitrogens = [r.nitrogen for r in readings if r.nitrogen is not None]
    valid_phosphorus = [r.phosphorus for r in readings if r.phosphorus is not None]
    valid_potassiums = [r.potassium for r in readings if r.potassium is not None]
    valid_phs = [r.ph for r in readings if r.ph is not None]

    avg_moisture = round(sum(valid_moistures) / len(valid_moistures), 2) if valid_moistures else 60.0
    avg_n = round(sum(valid_nitrogens) / len(valid_nitrogens), 2) if valid_nitrogens else 50.0
    avg_p = round(sum(valid_phosphorus) / len(valid_phosphorus), 2) if valid_phosphorus else 25.0
    avg_k = round(sum(valid_potassiums) / len(valid_potassiums), 2) if valid_potassiums else 200.0
    avg_ph = round(sum(valid_phs) / len(valid_phs), 2) if valid_phs else 6.8

    # Trend direction for moisture
    if len(valid_moistures) >= 2:
        m_delta = valid_moistures[-1] - valid_moistures[0]
        m_trend = "Depleting" if m_delta < -3.0 else ("Increasing" if m_delta > 3.0 else "Stable")
    else:
        m_trend = "Stable"

    return {
        "field_id": field_id,
        "field_name": field.name,
        "period_days": days,
        "readings_count": len(readings),
        "readings": [schemas.SensorReadingResponse.model_validate(r) for r in readings],
        "analytics": {
            "avg_moisture": avg_moisture,
            "avg_nitrogen": avg_n,
            "avg_phosphorus": avg_p,
            "avg_potassium": avg_k,
            "avg_ph": avg_ph,
            "moisture_trend": m_trend
        }
    }

@router.get("/{field_id}", response_model=schemas.FieldResponse)
def get_field(
    field_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    field = verify_field_ownership(field_id, current_user, db)
    return field

@router.put("/{field_id}", response_model=schemas.FieldResponse)
def update_field(
    field_id: int,
    field_in: schemas.FieldUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    field = verify_field_ownership(field_id, current_user, db)
    
    update_data = field_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(field, key, value)
        
    db.commit()
    db.refresh(field)
    return field

@router.delete("/{field_id}")
def delete_field(
    field_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    field = verify_field_ownership(field_id, current_user, db)
    
    db.delete(field)
    db.commit()
    return {"detail": "Field deleted successfully"}
