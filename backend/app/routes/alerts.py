from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app import models, schemas
from app.database import get_db
from app.auth import get_current_active_user
from app.routes.sensors import verify_field_ownership

router = APIRouter(prefix="/alerts", tags=["alerts"])

@router.get("/{field_id}", response_model=List[schemas.AlertResponse])
def get_alerts(
    field_id: int,
    include_resolved: bool = False,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    verify_field_ownership(field_id, current_user, db)
    
    query = db.query(models.Alert).filter(models.Alert.field_id == field_id)
    if not include_resolved:
        query = query.filter(models.Alert.is_resolved == False)
        
    alerts = query.order_by(models.Alert.created_at.desc()).all()
    return alerts

@router.put("/{alert_id}/resolve", response_model=schemas.AlertResponse)
def resolve_alert(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    alert = db.query(models.Alert).join(models.Field).filter(
        models.Alert.id == alert_id,
        models.Field.owner_id == current_user.id
    ).first()
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
        
    if alert.is_resolved:
        return alert
        
    alert.is_resolved = True
    alert.resolved_at = datetime.utcnow()
    db.commit()
    db.refresh(alert)
    return alert
