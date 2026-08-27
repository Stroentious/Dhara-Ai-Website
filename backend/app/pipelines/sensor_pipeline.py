"""
Live Soil Monitoring & Sensor Ingestion Pipeline
================================================
Pipeline 1: 7-in-1 NPK Sensor → LoRa / Secure API → Validation → Normalization → DB → Field Health & Alerts.
"""

from typing import Dict, Any, Optional, Tuple
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
import logging

from app import models, schemas
from app.services.alert_service import check_and_create_alerts

logger = logging.getLogger(__name__)

# Standard Physical Limits for Agricultural Soil Sensors
SENSOR_PHYSICAL_LIMITS = {
    "nitrogen": (0.0, 9999.0, "mg/kg"),
    "phosphorus": (0.0, 9999.0, "mg/kg"),
    "potassium": (0.0, 9999.0, "mg/kg"),
    "ph": (0.0, 14.0, "pH"),
    "ec": (0.0, 100.0, "dS/m"),
    "soil_moisture": (0.0, 100.0, "%"),
    "soil_temperature": (-50.0, 100.0, "°C")
}

class SensorValidationError(Exception):
    """Raised when sensor reading violates physical sanity checks or device validation."""
    pass

class SensorPipeline:
    """
    Ingestion, validation, normalization, and persistence pipeline for 7-in-1 NPK sensor data.
    """

    @classmethod
    def validate_reading_ranges(cls, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Ensures all numerical sensor inputs fall strictly within physical ranges.
        Prevents corrupted packets, sensor faults, or tampered values.
        """
        for param, (min_val, max_val, unit) in SENSOR_PHYSICAL_LIMITS.items():
            val = data.get(param)
            if val is not None:
                try:
                    num_val = float(val)
                    if num_val < min_val or num_val > max_val:
                        raise SensorValidationError(
                            f"Invalid {param} value: {num_val} {unit}. Allowed range: [{min_val}, {max_val}]."
                        )
                except (ValueError, TypeError):
                    raise SensorValidationError(f"Invalid numerical format for {param}: {val}")
        return data

    @classmethod
    def normalize_sensor_data(cls, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Normalizes sensor numbers (rounding to 2 decimals) and validates timestamp.
        """
        normalized = {}
        for param in SENSOR_PHYSICAL_LIMITS.keys():
            val = data.get(param)
            if val is not None:
                normalized[param] = round(float(val), 2)
            else:
                normalized[param] = None

        # Normalize Timestamp
        raw_ts = data.get("timestamp")
        now = datetime.utcnow()
        if isinstance(raw_ts, datetime):
            ts = raw_ts
        elif isinstance(raw_ts, str):
            try:
                ts = datetime.fromisoformat(raw_ts.replace("Z", "+00:00")).replace(tzinfo=None)
            except Exception:
                ts = now
        else:
            ts = now

        # Prevent timestamps far in the future (> 5 mins) or too old (> 30 days)
        if ts > now + timedelta(minutes=5):
            ts = now
        elif ts < now - timedelta(days=30):
            ts = now

        normalized["timestamp"] = ts
        return normalized

    @classmethod
    def ingest_sensor_reading(
        cls,
        db: Session,
        device_id: str,
        sensor_data: Dict[str, Any],
        raw_payload: Optional[Dict[str, Any]] = None,
        field_id: Optional[int] = None
    ) -> Tuple[models.SensorReading, int]:
        """
        Full Pipeline Execution:
        1. Device validation (active & registered)
        2. Range & physical validity check
        3. Normalization
        4. Persistence in Database
        5. Trigger alert evaluation
        6. Return reading and count of alerts created
        """
        # Step 1: Device Verification
        device = db.query(models.SensorDevice).filter(
            models.SensorDevice.device_id == device_id
        ).first()

        if not device:
            raise SensorValidationError(f"Sensor device '{device_id}' is not registered in DHARA AI.")
        
        if not device.is_active:
            raise SensorValidationError(f"Sensor device '{device_id}' is deactivated.")

        # Ensure field matches if explicitly provided
        if field_id is not None and device.field_id != field_id:
            raise SensorValidationError(f"Device '{device_id}' belongs to field {device.field_id}, not {field_id}.")

        # Step 2: Validate Ranges
        cls.validate_reading_ranges(sensor_data)

        # Step 3: Normalize Data
        normalized = cls.normalize_sensor_data(sensor_data)

        # Step 4: Persist in Database
        reading = models.SensorReading(
            field_id=device.field_id,
            device_id=device.id,
            timestamp=normalized["timestamp"],
            nitrogen=normalized.get("nitrogen"),
            phosphorus=normalized.get("phosphorus"),
            potassium=normalized.get("potassium"),
            ph=normalized.get("ph"),
            ec=normalized.get("ec"),
            soil_moisture=normalized.get("soil_moisture"),
            soil_temperature=normalized.get("soil_temperature"),
            raw_payload=raw_payload or sensor_data
        )
        db.add(reading)

        # Update Device last seen
        device.last_seen = normalized["timestamp"]

        # Step 5: Check and generate alerts
        initial_alerts_count = db.query(models.Alert).filter(
            models.Alert.field_id == device.field_id,
            models.Alert.is_resolved == False
        ).count()

        check_and_create_alerts(device.field_id, reading, db)

        final_alerts_count = db.query(models.Alert).filter(
            models.Alert.field_id == device.field_id,
            models.Alert.is_resolved == False
        ).count()

        alerts_triggered = max(0, final_alerts_count - initial_alerts_count)

        db.commit()
        db.refresh(reading)

        logger.info(f"Successfully ingested sensor reading for device {device_id} (Field {device.field_id}).")
        return reading, alerts_triggered
