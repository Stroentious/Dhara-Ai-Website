from sqlalchemy.orm import Session
from app import models
from app.models import AlertTypeEnum, SeverityEnum
from datetime import datetime

def check_and_create_alerts(field_id: int, reading: models.SensorReading, db: Session):
    """
    Check sensor readings against thresholds and generate alerts if necessary.
    Avoids duplicate unresolved alerts.
    """
    alerts_to_create = []

    # Check for Low Moisture
    if reading.soil_moisture is not None and reading.soil_moisture < 30.0:
        alerts_to_create.append({
            "type": AlertTypeEnum.LOW_MOISTURE,
            "severity": SeverityEnum.HIGH,
            "message": f"Soil moisture is critically low: {reading.soil_moisture}%"
        })

    # Check for Nutrient Deficiency
    nd_reasons = []
    if reading.nitrogen is not None and reading.nitrogen < 30.0:
        nd_reasons.append(f"Nitrogen ({reading.nitrogen} mg/kg)")
    if reading.phosphorus is not None and reading.phosphorus < 15.0:
        nd_reasons.append(f"Phosphorus ({reading.phosphorus} mg/kg)")
    if reading.potassium is not None and reading.potassium < 100.0:
        nd_reasons.append(f"Potassium ({reading.potassium} mg/kg)")
    
    if nd_reasons:
        alerts_to_create.append({
            "type": AlertTypeEnum.NUTRIENT_DEFICIENCY,
            "severity": SeverityEnum.MEDIUM,
            "message": "Nutrient deficiency detected: " + ", ".join(nd_reasons)
        })

    # Check for High Temperature
    if reading.soil_temperature is not None and reading.soil_temperature > 40.0:
        alerts_to_create.append({
            "type": AlertTypeEnum.HIGH_TEMPERATURE,
            "severity": SeverityEnum.HIGH,
            "message": f"Soil temperature is dangerously high: {reading.soil_temperature}°C"
        })
        
    # Check for Abnormal Readings (Out of typical ag ranges)
    if (reading.ph is not None and (reading.ph < 4.5 or reading.ph > 8.5)) or \
       (reading.ec is not None and reading.ec > 4.0):
        alerts_to_create.append({
            "type": AlertTypeEnum.ABNORMAL_READING,
            "severity": SeverityEnum.CRITICAL,
            "message": "Abnormal soil pH or EC detected. Please verify sensor calibration."
        })

    for alert_data in alerts_to_create:
        # Check if an unresolved alert of this type already exists for this field
        existing_alert = db.query(models.Alert).filter(
            models.Alert.field_id == field_id,
            models.Alert.alert_type == alert_data["type"],
            models.Alert.is_resolved == False
        ).first()

        if not existing_alert:
            new_alert = models.Alert(
                field_id=field_id,
                alert_type=alert_data["type"],
                severity=alert_data["severity"],
                message=alert_data["message"]
            )
            db.add(new_alert)
    
    db.commit()
