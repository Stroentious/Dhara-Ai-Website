from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app import models, schemas
from app.database import get_db
from app.auth import get_current_active_user
from app.routes.sensors import verify_field_ownership
from app.services.hardware_controller import HardwareControllerService

router = APIRouter(prefix="/valves", tags=["valves"])

@router.get("", response_model=List[schemas.ValveResponse])
def list_valves(
    field_id: int = Query(..., description="Field ID to list valves for"),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    verify_field_ownership(field_id, current_user, db)
    valves = HardwareControllerService.get_or_create_field_valves(db, field_id)
    return valves

@router.get("/{valve_id}", response_model=schemas.ValveResponse)
def get_valve(
    valve_id: str,
    field_id: int = Query(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    verify_field_ownership(field_id, current_user, db)
    valve = db.query(models.Valve).filter(
        models.Valve.field_id == field_id,
        models.Valve.valve_id == valve_id
    ).first()
    if not valve:
        raise HTTPException(status_code=404, detail="Valve not found")
    return valve

@router.post("/{valve_id}/open", response_model=schemas.ValveActionResponse)
def open_valve(
    valve_id: str,
    field_id: int = Query(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    verify_field_ownership(field_id, current_user, db)
    updated_valve = HardwareControllerService.control_valve(
        db=db,
        field_id=field_id,
        valve_id_str=valve_id,
        action="OPEN",
        user_email=current_user.email
    )
    mode = HardwareControllerService.get_hardware_mode()
    return {
        "success": True,
        "message": f"Valve {valve_id} opened ({mode.value} mode)",
        "valve": updated_valve,
        "hardware_mode": mode
    }

@router.post("/{valve_id}/close", response_model=schemas.ValveActionResponse)
def close_valve(
    valve_id: str,
    field_id: int = Query(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    verify_field_ownership(field_id, current_user, db)
    updated_valve = HardwareControllerService.control_valve(
        db=db,
        field_id=field_id,
        valve_id_str=valve_id,
        action="CLOSE",
        user_email=current_user.email
    )
    mode = HardwareControllerService.get_hardware_mode()
    return {
        "success": True,
        "message": f"Valve {valve_id} closed ({mode.value} mode)",
        "valve": updated_valve,
        "hardware_mode": mode
    }
