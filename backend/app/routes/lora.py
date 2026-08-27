from fastapi import APIRouter, Depends, Request, Header
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address

from app import models, schemas
from app.database import get_db
from app.lora_adapter import lora_adapter, LoRaPacketError
from app.pipelines.sensor_pipeline import SensorPipeline, SensorValidationError
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/lora", tags=["lora"])
limiter = Limiter(key_func=get_remote_address)

@router.post("/uplink")
@limiter.limit("60/minute")
def receive_uplink(
    request: Request,
    payload: schemas.LoRaUplinkPayload,
    x_device_id: str = Header(..., alias="X-Device-ID"),
    x_device_signature: str = Header(None, alias="X-Device-Signature"),
    db: Session = Depends(get_db)
):
    try:
        # Validate device exists and is active
        device = db.query(models.SensorDevice).filter(
            models.SensorDevice.device_id == x_device_id,
            models.SensorDevice.is_active == True
        ).first()
        
        if not device:
            logger.warning(f"LoRa Uplink received from unknown or inactive device {x_device_id}")
            return {"status": "accepted"}

        # Process via LoRa Adapter (Signature validation & packet parsing)
        try:
            parsed_data = lora_adapter.process_uplink(
                device_id=x_device_id,
                payload=payload.model_dump(),
                signature=x_device_signature
            )
        except LoRaPacketError as e:
            logger.warning(f"LoRa packet error for device {x_device_id}: {str(e)}")
            return {"status": "accepted"}

        # Ingest via unified SensorPipeline
        try:
            SensorPipeline.ingest_sensor_reading(
                db=db,
                device_id=x_device_id,
                sensor_data=parsed_data,
                raw_payload=payload.model_dump()
            )
            return {"status": "success"}
        except SensorValidationError as val_err:
            logger.warning(f"SensorPipeline validation rejected LoRa reading: {val_err}")
            return {"status": "accepted"}

    except Exception as e:
        logger.error(f"Internal error processing LoRa uplink: {str(e)}")
        db.rollback()
        return {"status": "accepted"}
