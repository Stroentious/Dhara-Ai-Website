from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app import models, schemas
from app.database import get_db
from app.auth import get_current_active_user
from app.routes.sensors import verify_field_ownership
from app.mock_data import generate_mock_sensor_reading, generate_mock_weather

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/summary", response_model=schemas.DashboardResponse)
def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Returns dashboard metrics for the user's primary/first field."""
    field = db.query(models.Field).filter(models.Field.owner_id == current_user.id).first()
    if not field:
        field = models.Field(
            name="North Wheat Field (Plot 4A)",
            crop_type="Wheat (PBW 550)",
            soil_type="Alluvial Loam",
            area_hectares=2.5,
            location="Karnal, Haryana",
            owner_id=current_user.id
        )
        db.add(field)
        db.commit()
        db.refresh(field)
    return get_dashboard(field.id, db, current_user)

@router.get("", response_model=schemas.DashboardResponse)
def get_dashboard_root(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Alias for dashboard summary."""
    return get_dashboard_summary(db, current_user)

@router.get("/{field_id}", response_model=schemas.DashboardResponse)
def get_dashboard(
    field_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):

    field = verify_field_ownership(field_id, current_user, db)
    
    # Latest readings
    latest_reading = db.query(models.SensorReading).filter(
        models.SensorReading.field_id == field_id
    ).order_by(models.SensorReading.timestamp.desc()).first()
    
    if not latest_reading:
        mock_data = generate_mock_sensor_reading(field_id)
        mock_data["id"] = 0
        mock_data["field_id"] = field_id
        mock_data["device_id"] = 0
        mock_data["timestamp"] = datetime.utcnow()
        latest_reading = schemas.SensorReadingResponse(**mock_data)
        
    # Recent alerts
    recent_alerts = db.query(models.Alert).filter(
        models.Alert.field_id == field_id,
        models.Alert.is_resolved == False
    ).order_by(models.Alert.created_at.desc()).limit(5).all()
    
    # Water stats
    one_week_ago = datetime.utcnow() - timedelta(days=7)
    recent_water = db.query(models.WaterUsage).filter(
        models.WaterUsage.field_id == field_id,
        models.WaterUsage.timestamp >= one_week_ago
    ).all()
    water_stats = {"total_this_week": sum(u.amount_liters for u in recent_water)}
    
    # Fertilizer stats
    recent_fert = db.query(models.FertilizerUsage).filter(
        models.FertilizerUsage.field_id == field_id,
        models.FertilizerUsage.timestamp >= one_week_ago
    ).all()
    fertilizer_stats = {"total_this_week": sum(u.amount_kg for u in recent_fert)}
    
    # Weather
    weather = generate_mock_weather()
    
    return schemas.DashboardResponse(
        field_info=schemas.FieldResponse.model_validate(field),
        latest_readings=latest_reading,
        recent_alerts=[schemas.AlertResponse.model_validate(a) for a in recent_alerts],
        water_stats=water_stats,
        fertilizer_stats=fertilizer_stats,
        weather=weather
    )
