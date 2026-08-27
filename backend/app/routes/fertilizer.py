from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List

from app import models, schemas
from app.database import get_db
from app.auth import get_current_active_user
from app.routes.sensors import verify_field_ownership
from app.pipelines.soil_decision_pipeline import SoilDecisionPipeline

router = APIRouter(prefix="/fertilizer", tags=["fertilizer"])

@router.get("/catalog", response_model=List[schemas.FertilizerCatalogItem])
def get_fertilizer_catalog(
    db: Session = Depends(get_db)
):
    """Retrieves all standard fertilizers registered in the DHARA AI database."""
    return db.query(models.FertilizerCatalog).filter(models.FertilizerCatalog.is_available == True).all()

@router.get("/compare")
def compare_fertilizers_get(
    fert_a: str = Query("DAP", description="First fertilizer name"),
    fert_b: str = Query("NPK Complex (12-32-16)", description="Second fertilizer name"),
    crop: str = Query("Wheat", description="Crop context"),
    db: Session = Depends(get_db)
):
    """
    Compares two fertilizers by NPK percentage, cost per nutrient kg, and crop suitability.
    """
    # Fetch from catalog or fallback to standard formulas
    catalog = db.query(models.FertilizerCatalog).all()
    catalog_map = {f.name.lower(): f for f in catalog}

    def resolve_fert(name: str):
        lowered = name.lower()
        for k, v in catalog_map.items():
            if lowered in k or k in lowered:
                return v
        return None

    obj_a = resolve_fert(fert_a)
    obj_b = resolve_fert(fert_b)

    # Defaults if not in catalog
    n_a = obj_a.nitrogen_percent if obj_a else (18.0 if "dap" in fert_a.lower() else (46.0 if "urea" in fert_a.lower() else 12.0))
    p_a = obj_a.phosphorus_percent if obj_a else (46.0 if "dap" in fert_a.lower() else 0.0)
    k_a = obj_a.potassium_percent if obj_a else (60.0 if "mop" in fert_a.lower() else 0.0)
    price_a = obj_a.price_inr if obj_a else 1350.0

    n_b = obj_b.nitrogen_percent if obj_b else (12.0 if "12-32-16" in fert_b.lower() else (46.0 if "urea" in fert_b.lower() else 20.0))
    p_b = obj_b.phosphorus_percent if obj_b else (32.0 if "12-32-16" in fert_b.lower() else 0.0)
    k_b = obj_b.potassium_percent if obj_b else (16.0 if "12-32-16" in fert_b.lower() else 20.0)
    price_b = obj_b.price_inr if obj_b else 1470.0

    tot_nutrients_a = (n_a + p_a + k_a) * 0.50 # 50kg bag
    tot_nutrients_b = (n_b + p_b + k_b) * 0.50

    cost_per_kg_nut_a = round(price_a / max(1.0, tot_nutrients_a), 2)
    cost_per_kg_nut_b = round(price_b / max(1.0, tot_nutrients_b), 2)

    item_a = schemas.FertilizerComparisonItem(
        fertilizer_name=obj_a.name if obj_a else fert_a,
        brand=obj_a.brand if obj_a else "IFFCO",
        npk_ratio=f"{n_a:.0f}-{p_a:.0f}-{k_a:.0f}",
        price_per_bag_inr=price_a,
        cost_per_kg_n=round(price_a / (n_a * 0.50), 2) if n_a > 0 else None,
        cost_per_kg_p=round(price_a / (p_a * 0.50), 2) if p_a > 0 else None,
        cost_per_kg_k=round(price_a / (k_a * 0.50), 2) if k_a > 0 else None,
        cost_per_nutrient_kg_avg=cost_per_kg_nut_a,
        suitability=obj_a.suitability if obj_a else "Standard nutrient source",
        rank=1 if cost_per_kg_nut_a <= cost_per_kg_nut_b else 2
    )

    item_b = schemas.FertilizerComparisonItem(
        fertilizer_name=obj_b.name if obj_b else fert_b,
        brand=obj_b.brand if obj_b else "Gromor",
        npk_ratio=f"{n_b:.0f}-{p_b:.0f}-{k_b:.0f}",
        price_per_bag_inr=price_b,
        cost_per_kg_n=round(price_b / (n_b * 0.50), 2) if n_b > 0 else None,
        cost_per_kg_p=round(price_b / (p_b * 0.50), 2) if p_b > 0 else None,
        cost_per_kg_k=round(price_b / (k_b * 0.50), 2) if k_b > 0 else None,
        cost_per_nutrient_kg_avg=cost_per_kg_nut_b,
        suitability=obj_b.suitability if obj_b else "Balanced complex source",
        rank=1 if cost_per_kg_nut_b < cost_per_kg_nut_a else 2
    )

    return {
        "crop": crop,
        "fertilizer_a": item_a,
        "fertilizer_b": item_b,
        "cost_efficiency_winner": item_a.fertilizer_name if cost_per_kg_nut_a <= cost_per_kg_nut_b else item_b.fertilizer_name,
        "summary": f"For {crop}, {item_a.fertilizer_name} costs ₹{cost_per_kg_nut_a}/kg of active nutrient vs ₹{cost_per_kg_nut_b}/kg for {item_b.fertilizer_name}."
    }

@router.get("/rank/{field_id}", response_model=schemas.FertilizerRankResponse)
def rank_fertilizers_for_field(
    field_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """
    Evaluates field soil test readings and returns ranked commercial fertilizers
    customized to correct the exact nutrient deficiencies.
    """
    field = verify_field_ownership(field_id, current_user, db)

    latest_reading = db.query(models.SensorReading).filter(
        models.SensorReading.field_id == field_id
    ).order_by(models.SensorReading.timestamp.desc()).first()

    fert_summary = SoilDecisionPipeline.calculate_fertilizer_requirement(latest_reading, field)
    soil_summary = SoilDecisionPipeline.analyze_soil_health(latest_reading, field.crop_type)

    catalog = db.query(models.FertilizerCatalog).filter(models.FertilizerCatalog.is_available == True).all()

    ranked_items = []
    for idx, f in enumerate(catalog, 1):
        tot_nut = (f.nitrogen_percent + f.phosphorus_percent + f.potassium_percent) * (f.package_size_kg / 100.0)
        cost_per_nut = round(f.price_inr / max(1.0, tot_nut), 2)
        ranked_items.append(schemas.FertilizerComparisonItem(
            fertilizer_name=f.name,
            brand=f.brand,
            npk_ratio=f"{f.nitrogen_percent:.0f}-{f.phosphorus_percent:.0f}-{f.potassium_percent:.0f}",
            price_per_bag_inr=f.price_inr,
            cost_per_kg_n=round(f.price_inr / (f.nitrogen_percent * f.package_size_kg / 100.0), 2) if f.nitrogen_percent > 0 else None,
            cost_per_kg_p=round(f.price_inr / (f.phosphorus_percent * f.package_size_kg / 100.0), 2) if f.phosphorus_percent > 0 else None,
            cost_per_kg_k=round(f.price_inr / (f.potassium_percent * f.package_size_kg / 100.0), 2) if f.potassium_percent > 0 else None,
            cost_per_nutrient_kg_avg=cost_per_nut,
            suitability=f.suitability or "Standard application",
            rank=idx
        ))

    return schemas.FertilizerRankResponse(
        crop=field.crop_type or "Wheat",
        field_id=field.id,
        detected_deficiency={
            "nitrogen_status": soil_summary.nitrogen_status,
            "phosphorus_status": soil_summary.phosphorus_status,
            "potassium_status": soil_summary.potassium_status
        },
        ranked_fertilizers=ranked_items,
        top_recommendation=fert_summary.application_guidelines
    )

@router.get("/{field_id}")
def get_fertilizer_history(
    field_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    verify_field_ownership(field_id, current_user, db)
    
    usages = db.query(models.FertilizerUsage).filter(
        models.FertilizerUsage.field_id == field_id
    ).order_by(models.FertilizerUsage.timestamp.desc()).limit(50).all()
    
    latest_reading = db.query(models.SensorReading).filter(
        models.SensorReading.field_id == field_id
    ).order_by(models.SensorReading.timestamp.desc()).first()
    
    npk_status = {"N": "Unknown", "P": "Unknown", "K": "Unknown"}
    if latest_reading:
        if latest_reading.nitrogen is not None:
            npk_status["N"] = "Low" if latest_reading.nitrogen < 30 else "Normal"
        if latest_reading.phosphorus is not None:
            npk_status["P"] = "Low" if latest_reading.phosphorus < 15 else "Normal"
        if latest_reading.potassium is not None:
            npk_status["K"] = "Low" if latest_reading.potassium < 100 else "Normal"
            
    return {
        "history": [schemas.FertilizerUsageResponse.model_validate(u) for u in usages],
        "analysis": {
            "npk_balance": npk_status
        }
    }

@router.post("", response_model=schemas.FertilizerUsageResponse)
def log_fertilizer_usage(
    usage_in: schemas.FertilizerUsageCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    verify_field_ownership(usage_in.field_id, current_user, db)
    
    new_usage = models.FertilizerUsage(**usage_in.model_dump())
    db.add(new_usage)
    db.commit()
    db.refresh(new_usage)
    return new_usage
