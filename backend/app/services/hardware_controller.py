from typing import Tuple, List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import logging

from app import models
from app.config import settings

logger = logging.getLogger(__name__)

class HardwareControllerService:
    @staticmethod
    def get_hardware_mode() -> models.HardwareModeEnum:
        raw_mode = getattr(settings, "HARDWARE_MODE", "SIMULATION")
        if str(raw_mode).upper() == "REAL_HARDWARE":
            return models.HardwareModeEnum.REAL_HARDWARE
        return models.HardwareModeEnum.SIMULATION

    @classmethod
    def get_or_create_irrigation_status(cls, db: Session, field_id: int) -> models.IrrigationSystem:
        sys_status = db.query(models.IrrigationSystem).filter(
            models.IrrigationSystem.field_id == field_id
        ).first()

        hardware_mode = cls.get_hardware_mode()

        if not sys_status:
            sys_status = models.IrrigationSystem(
                field_id=field_id,
                system_state="OFF",
                hardware_mode=hardware_mode,
                is_connected=True,
                active_zone="Zone 1",
                last_operation="System Initialized",
                last_updated_at=datetime.utcnow()
            )
            db.add(sys_status)
            db.commit()
            db.refresh(sys_status)
        else:
            if sys_status.hardware_mode != hardware_mode:
                sys_status.hardware_mode = hardware_mode
                db.commit()

        return sys_status

    @classmethod
    def set_irrigation_state(
        cls, 
        db: Session, 
        field_id: int, 
        action: str, 
        user_email: str,
        zone: Optional[str] = None
    ) -> models.IrrigationSystem:
        action = action.upper()
        if action not in ["ON", "OFF"]:
            raise HTTPException(status_code=422, detail="Invalid action. Must be ON or OFF.")

        sys_status = cls.get_or_create_irrigation_status(db, field_id)
        hardware_mode = cls.get_hardware_mode()

        if not sys_status.is_connected:
            log = models.CommandLog(
                user_email=user_email,
                target_type="IRRIGATION",
                target_id=f"FIELD-{field_id}",
                action=action,
                status="FAILED",
                detail="Command failed – device is unavailable.",
                hardware_mode=hardware_mode.value
            )
            db.add(log)
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Command failed – device is unavailable."
            )

        target_zone = zone or sys_status.active_zone or "Zone 1"

        if sys_status.system_state == action:
            sys_status.last_updated_at = datetime.utcnow()
            db.commit()
            return sys_status

        if hardware_mode == models.HardwareModeEnum.REAL_HARDWARE:
            logger.info(f"[REAL_HARDWARE] Sending Irrigation {action} command to Field {field_id} Zone {target_zone}")
        else:
            logger.info(f"[SIMULATION] Simulated Irrigation {action} command executed for Field {field_id}")

        sys_status.system_state = action
        sys_status.active_zone = target_zone
        sys_status.last_operation = f"Turned {action} by {user_email}"
        sys_status.last_updated_at = datetime.utcnow()
        sys_status.hardware_mode = hardware_mode

        cmd_log = models.CommandLog(
            user_email=user_email,
            target_type="IRRIGATION",
            target_id=f"FIELD-{field_id}",
            action=action,
            status="SUCCESS",
            detail=f"Irrigation set to {action} on {target_zone}",
            hardware_mode=hardware_mode.value
        )
        db.add(cmd_log)
        db.commit()
        db.refresh(sys_status)

        return sys_status

    @classmethod
    def get_or_create_field_valves(cls, db: Session, field_id: int) -> List[models.Valve]:
        valves = db.query(models.Valve).filter(models.Valve.field_id == field_id).all()
        hardware_mode = cls.get_hardware_mode()

        if not valves:
            default_valves = [
                models.Valve(
                    valve_id=f"VALVE-IRR-Z1-F{field_id}",
                    name="Zone 1 - Main Field Irrigation Valve",
                    valve_type=models.ValveTypeEnum.IRRIGATION,
                    zone="Zone 1",
                    field_id=field_id,
                    state=models.ValveStateEnum.CLOSED,
                    is_connected=True,
                    hardware_mode=hardware_mode
                ),
                models.Valve(
                    valve_id=f"VALVE-IRR-Z2-F{field_id}",
                    name="Zone 2 - Secondary Sector Irrigation Valve",
                    valve_type=models.ValveTypeEnum.IRRIGATION,
                    zone="Zone 2",
                    field_id=field_id,
                    state=models.ValveStateEnum.CLOSED,
                    is_connected=True,
                    hardware_mode=hardware_mode
                ),
                models.Valve(
                    valve_id=f"VALVE-FERT-Z3-F{field_id}",
                    name="Zone 3 - NPK Dosing Line A (Nitrogen/Phosphorus)",
                    valve_type=models.ValveTypeEnum.FERTILIZER,
                    zone="Zone 3",
                    field_id=field_id,
                    state=models.ValveStateEnum.CLOSED,
                    is_connected=True,
                    hardware_mode=hardware_mode
                ),
                models.Valve(
                    valve_id=f"VALVE-FERT-Z4-F{field_id}",
                    name="Zone 4 - Micro-Nutrient Fertigation Valve B",
                    valve_type=models.ValveTypeEnum.FERTILIZER,
                    zone="Zone 4",
                    field_id=field_id,
                    state=models.ValveStateEnum.CLOSED,
                    is_connected=True,
                    hardware_mode=hardware_mode
                ),
            ]
            db.add_all(default_valves)
            db.commit()
            valves = db.query(models.Valve).filter(models.Valve.field_id == field_id).all()

        return valves

    @classmethod
    def control_valve(
        cls, 
        db: Session, 
        field_id: int, 
        valve_id_str: str, 
        action: str, 
        user_email: str
    ) -> models.Valve:
        action = action.upper()
        if action not in ["OPEN", "CLOSE"]:
            raise HTTPException(status_code=422, detail="Invalid action. Must be OPEN or CLOSE.")

        valve = db.query(models.Valve).filter(
            models.Valve.field_id == field_id,
            models.Valve.valve_id == valve_id_str
        ).first()

        if not valve:
            raise HTTPException(status_code=404, detail="Valve not found for this field.")

        hardware_mode = cls.get_hardware_mode()

        if not valve.is_connected:
            cmd_log = models.CommandLog(
                user_email=user_email,
                target_type="VALVE",
                target_id=valve_id_str,
                action=action,
                status="FAILED",
                detail="Command failed – device is unavailable.",
                hardware_mode=hardware_mode.value
            )
            db.add(cmd_log)
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Command failed – device is unavailable."
            )

        target_state = models.ValveStateEnum.OPEN if action == "OPEN" else models.ValveStateEnum.CLOSED

        if valve.state == target_state:
            valve.last_changed_at = datetime.utcnow()
            db.commit()
            return valve

        if hardware_mode == models.HardwareModeEnum.REAL_HARDWARE:
            logger.info(f"[REAL_HARDWARE] Triggering physical valve {valve_id_str} to {action}")
        else:
            logger.info(f"[SIMULATION] Simulating valve {valve_id_str} {action}")

        valve.state = target_state
        valve.last_changed_at = datetime.utcnow()
        valve.last_changed_by = user_email
        valve.hardware_mode = hardware_mode

        cmd_log = models.CommandLog(
            user_email=user_email,
            target_type="VALVE",
            target_id=valve_id_str,
            action=action,
            status="SUCCESS",
            detail=f"Valve {valve_id_str} set to {action}",
            hardware_mode=hardware_mode.value
        )
        db.add(cmd_log)
        db.commit()
        db.refresh(valve)

        return valve
