from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta

from app import models, schemas
from app.database import get_db
from app.auth import get_current_active_user
from app.routes.sensors import verify_field_ownership

router = APIRouter(prefix="/water", tags=["water"])

@router.get("/{field_id}")
def get_water_history(
    field_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    verify_field_ownership(field_id, current_user, db)
    
    # Get recent usages
    usages = db.query(models.WaterUsage).filter(
        models.WaterUsage.field_id == field_id
    ).order_by(models.WaterUsage.timestamp.desc()).limit(50).all()
    
    # Calculate stats
    one_week_ago = datetime.utcnow() - timedelta(days=7)
    recent_usages = db.query(models.WaterUsage).filter(
        models.WaterUsage.field_id == field_id,
        models.WaterUsage.timestamp >= one_week_ago
    ).all()
    
    total_week_liters = sum(u.amount_liters for u in recent_usages)
    
    # Get latest moisture to recommend
    latest_reading = db.query(models.SensorReading).filter(
        models.SensorReading.field_id == field_id
    ).order_by(models.SensorReading.timestamp.desc()).first()
    
    recommended = "Normal"
    if latest_reading and latest_reading.soil_moisture is not None:
        if latest_reading.soil_moisture < 30:
            recommended = "High (Soil is dry)"
        elif latest_reading.soil_moisture > 70:
            recommended = "None (Soil is sufficiently wet)"
            
    return {
        "history": [schemas.WaterUsageResponse.model_validate(u) for u in usages],
        "stats": {
            "total_this_week_liters": total_week_liters,
            "recommended_action": recommended
        }
    }

@router.post("", response_model=schemas.WaterUsageResponse)
def log_water_usage(
    usage_in: schemas.WaterUsageCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    verify_field_ownership(usage_in.field_id, current_user, db)
    
    new_usage = models.WaterUsage(**usage_in.model_dump())
    db.add(new_usage)
    db.commit()
    db.refresh(new_usage)
    return new_usage
