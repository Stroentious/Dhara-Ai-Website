from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.auth import get_current_active_user
from app.routes.sensors import verify_field_ownership
from app.services.hardware_controller import HardwareControllerService

router = APIRouter(prefix="/irrigation", tags=["irrigation"])

@router.get("/status", response_model=schemas.IrrigationStatusResponse)
def get_irrigation_status(
    field_id: int = Query(..., description="Field ID to fetch irrigation status for"),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    verify_field_ownership(field_id, current_user, db)
    status_obj = HardwareControllerService.get_or_create_irrigation_status(db, field_id)
    return status_obj

@router.post("/on", response_model=schemas.IrrigationActionResponse)
def turn_irrigation_on(
    payload: schemas.IrrigationControlRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    verify_field_ownership(payload.field_id, current_user, db)
    status_obj = HardwareControllerService.set_irrigation_state(
        db=db,
        field_id=payload.field_id,
        action="ON",
        user_email=current_user.email,
        zone=payload.zone
    )
    mode = HardwareControllerService.get_hardware_mode()
    return {
        "success": True,
        "message": f"Irrigation system turned ON ({mode.value} mode)",
        "system_status": status_obj,
        "hardware_mode": mode
    }

@router.post("/off", response_model=schemas.IrrigationActionResponse)
def turn_irrigation_off(
    payload: schemas.IrrigationControlRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    verify_field_ownership(payload.field_id, current_user, db)
    status_obj = HardwareControllerService.set_irrigation_state(
        db=db,
        field_id=payload.field_id,
        action="OFF",
        user_email=current_user.email,
        zone=payload.zone
    )
    mode = HardwareControllerService.get_hardware_mode()
    return {
        "success": True,
        "message": f"Irrigation system turned OFF ({mode.value} mode)",
        "system_status": status_obj,
        "hardware_mode": mode
    }
