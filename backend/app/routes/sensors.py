from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app import models, schemas
from app.database import get_db
from app.auth import get_current_active_user
from app.mock_data import generate_mock_history, generate_mock_sensor_reading
from app.pipelines.sensor_pipeline import SensorPipeline, SensorValidationError

router = APIRouter(prefix="/sensors", tags=["sensors"])

def verify_field_ownership(field_id: int, current_user: models.User, db: Session) -> models.Field:
    field = db.query(models.Field).filter(
        models.Field.id == field_id,
        models.Field.owner_id == current_user.id
    ).first()
    if not field:
        raise HTTPException(status_code=404, detail="Field not found")
    return field

@router.post("/data", response_model=schemas.SensorIngestResponse)
def ingest_sensor_data(
    payload: schemas.SensorIngestRequest,
    db: Session = Depends(get_db)
):
    """
    Ingestion endpoint for 7-in-1 Soil Sensors & IoT Gateways:
    Validates device registration, checks physical value ranges, normalizes data,
    stores in DB, and evaluates immediate alerts.
    """
    try:
        reading, alerts_count = SensorPipeline.ingest_sensor_reading(
            db=db,
            device_id=payload.device_id,
            sensor_data=payload.model_dump(exclude_unset=True),
            raw_payload=payload.raw_payload
        )
        return schemas.SensorIngestResponse(
            success=True,
            message="Sensor reading successfully validated and recorded.",
            reading_id=reading.id,
            field_id=reading.field_id,
            device_id=payload.device_id,
            timestamp=reading.timestamp,
            alerts_triggered=alerts_count
        )
    except SensorValidationError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal error during sensor data processing.")

@router.get("/latest/{field_id}", response_model=schemas.SensorReadingResponse)
def get_latest_reading(
    field_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    verify_field_ownership(field_id, current_user, db)
    
    latest_reading = db.query(models.SensorReading).filter(
        models.SensorReading.field_id == field_id
    ).order_by(models.SensorReading.timestamp.desc()).first()
    
    if not latest_reading:
        # Return mock data if no real data
        mock_data = generate_mock_sensor_reading(field_id)
        mock_data["id"] = 0
        mock_data["field_id"] = field_id
        mock_data["device_id"] = 0
        mock_data["timestamp"] = __import__('datetime').datetime.utcnow()
        return mock_data
        
    return latest_reading

@router.get("/history/{field_id}", response_model=List[schemas.SensorReadingResponse])
def get_reading_history(
    field_id: int,
    limit: int = 168,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    verify_field_ownership(field_id, current_user, db)
    
    readings = db.query(models.SensorReading).filter(
        models.SensorReading.field_id == field_id
    ).order_by(models.SensorReading.timestamp.desc()).limit(limit).all()
    
    if not readings:
        # Return mock history if no real data
        mock_history = generate_mock_history(field_id, days=limit//24 if limit >= 24 else 1)
        for i, m in enumerate(mock_history):
            m["id"] = i
            m["field_id"] = field_id
            m["device_id"] = 0
        return mock_history
        
    return list(reversed(readings))

@router.get("/devices/{field_id}", response_model=List[schemas.SensorDeviceResponse])
def get_devices(
    field_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    verify_field_ownership(field_id, current_user, db)
    devices = db.query(models.SensorDevice).filter(models.SensorDevice.field_id == field_id).all()
    return devices

@router.post("/devices", response_model=schemas.SensorDeviceResponse)
def register_device(
    device_in: schemas.SensorDeviceCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    verify_field_ownership(device_in.field_id, current_user, db)
    
    existing = db.query(models.SensorDevice).filter(models.SensorDevice.device_id == device_in.device_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Device ID already registered")
        
    new_device = models.SensorDevice(**device_in.model_dump())
    db.add(new_device)
    db.commit()
    db.refresh(new_device)
    return new_device
