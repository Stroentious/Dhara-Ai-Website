"""
Recommendations API Routes
==========================
Endpoints for retrieving, generating, and applying rule-based agronomic recommendations.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app import models, schemas
from app.database import get_db
from app.auth import get_current_active_user
from app.routes.sensors import verify_field_ownership
from app.pipelines.soil_decision_pipeline import SoilDecisionPipeline
from app.pipelines.weather_decision_pipeline import WeatherDecisionPipeline

router = APIRouter(prefix="/recommendations", tags=["recommendations"])

@router.get("", response_model=List[schemas.RecommendationResponse])
def get_all_recommendations(
    is_applied: Optional[bool] = False,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Retrieves all active or past agronomic recommendations across all user fields."""
    user_field_ids = [f.id for f in db.query(models.Field).filter(models.Field.owner_id == current_user.id).all()]
    
    query = db.query(models.Recommendation).filter(
        models.Recommendation.field_id.in_(user_field_ids)
    )
    if is_applied is not None:
        query = query.filter(models.Recommendation.is_applied == is_applied)
        
    return query.order_by(models.Recommendation.created_at.desc()).all()

@router.get("/{field_id}", response_model=List[schemas.RecommendationResponse])
def get_field_recommendations(
    field_id: int,
    is_applied: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Retrieves recommendations specifically for the requested field with IDOR verification."""
    verify_field_ownership(field_id, current_user, db)

    query = db.query(models.Recommendation).filter(
        models.Recommendation.field_id == field_id
    )
    if is_applied is not None:
        query = query.filter(models.Recommendation.is_applied == is_applied)

    recs = query.order_by(models.Recommendation.created_at.desc()).all()

    # If empty and is_applied is False/None, generate fresh recommendations from decision pipeline
    if not recs and is_applied is not True:
        recs = SoilDecisionPipeline.evaluate_and_generate_recommendations(db=db, field_id=field_id)

    return recs

@router.post("/{field_id}/generate", response_model=List[schemas.RecommendationResponse])
async def generate_field_recommendations(
    field_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Triggers the full Soil + Water + Fertilizer + Weather decision pipeline to generate fresh recommendations."""
    field = verify_field_ownership(field_id, current_user, db)

    weather_resp = await WeatherDecisionPipeline.fetch_weather(
        location=field.location or "Karnal, Haryana",
        db=db,
        field_id=field_id
    )

    recs = SoilDecisionPipeline.evaluate_and_generate_recommendations(
        db=db,
        field_id=field_id,
        rain_probability_percent=weather_resp.rain_probability_percent,
        precipitation_mm=weather_resp.precipitation_expected_mm
    )
    return recs

@router.put("/{rec_id}/apply", response_model=schemas.RecommendationResponse)
def apply_recommendation(
    rec_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Marks a recommendation as applied by the farmer."""
    rec = db.query(models.Recommendation).filter(models.Recommendation.id == rec_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")

    # Verify field ownership
    verify_field_ownership(rec.field_id, current_user, db)

    rec.is_applied = True
    rec.applied_at = datetime.utcnow()
    db.commit()
    db.refresh(rec)
    return rec
