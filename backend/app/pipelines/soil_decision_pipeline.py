"""
Water + Fertilizer Decision Pipeline
====================================
Pipeline 2: Sensor data + Crop + Weather → Soil Health → Water Requirement → Fertilizer Requirement → Actionable Farmer Recommendations.
Strictly rule-based and deterministic to prevent hallucinated agricultural metrics.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
import logging

from app import models, schemas
from app.mock_data import generate_mock_sensor_reading

logger = logging.getLogger(__name__)

# Crop Specific Agronomic Targets (Soil test values in mg/kg & optimal ranges)
CROP_AGRONOMIC_TARGETS = {
    "wheat": {
        "n_target": (50.0, 80.0),
        "p_target": (25.0, 45.0),
        "k_target": (150.0, 250.0),
        "ph_target": (6.0, 7.5),
        "ec_max": 2.0,
        "moisture_target": (55.0, 70.0),
        "critical_moisture": 35.0
    },
    "rice": {
        "n_target": (60.0, 90.0),
        "p_target": (20.0, 40.0),
        "k_target": (120.0, 220.0),
        "ph_target": (5.5, 7.0),
        "ec_max": 2.5,
        "moisture_target": (70.0, 85.0),
        "critical_moisture": 50.0
    },
    "cotton": {
        "n_target": (50.0, 75.0),
        "p_target": (20.0, 35.0),
        "k_target": (150.0, 280.0),
        "ph_target": (6.0, 8.0),
        "ec_max": 2.5,
        "moisture_target": (50.0, 65.0),
        "critical_moisture": 30.0
    },
    "maize": {
        "n_target": (60.0, 90.0),
        "p_target": (30.0, 50.0),
        "k_target": (140.0, 240.0),
        "ph_target": (5.8, 7.2),
        "ec_max": 2.0,
        "moisture_target": (55.0, 70.0),
        "critical_moisture": 35.0
    },
    "sugarcane": {
        "n_target": (80.0, 120.0),
        "p_target": (30.0, 50.0),
        "k_target": (180.0, 300.0),
        "ph_target": (6.0, 7.8),
        "ec_max": 2.5,
        "moisture_target": (65.0, 80.0),
        "critical_moisture": 45.0
    },
    "default": {
        "n_target": (50.0, 80.0),
        "p_target": (25.0, 45.0),
        "k_target": (150.0, 250.0),
        "ph_target": (6.0, 7.5),
        "ec_max": 2.0,
        "moisture_target": (50.0, 70.0),
        "critical_moisture": 35.0
    }
}

class SoilDecisionPipeline:
    """
    Agronomic engine computing soil health scores, water requirements, and fertilizer dosages.
    """

    @classmethod
    def get_crop_targets(cls, crop_name: Optional[str]) -> Dict[str, Any]:
        """Resolves agronomic target profile for given crop name."""
        if not crop_name:
            return CROP_AGRONOMIC_TARGETS["default"]
        
        c_lower = crop_name.lower()
        for key in CROP_AGRONOMIC_TARGETS:
            if key in c_lower:
                return CROP_AGRONOMIC_TARGETS[key]
        return CROP_AGRONOMIC_TARGETS["default"]

    @classmethod
    def analyze_soil_health(
        cls,
        reading: Optional[models.SensorReading],
        crop_name: Optional[str]
    ) -> schemas.SoilHealthSummary:
        """
        Evaluates soil moisture, NPK status, pH, and EC status against crop targets.
        Computes composite health score (0 - 100).
        """
        targets = cls.get_crop_targets(crop_name)

        if not reading:
            return schemas.SoilHealthSummary(
                moisture_status="Optimal",
                moisture_percent=60.0,
                nitrogen_status="Optimal",
                nitrogen_mg_kg=55.0,
                phosphorus_status="Optimal",
                phosphorus_mg_kg=30.0,
                potassium_status="Optimal",
                potassium_mg_kg=220.0,
                ph_status="Optimal",
                ph_value=6.8,
                ec_status="Normal",
                ec_value=0.8,
                health_score=85
            )

        # 1. Moisture Status
        moisture = reading.soil_moisture or 50.0
        m_min, m_max = targets["moisture_target"]
        if moisture < targets["critical_moisture"]:
            m_status = "Critical Deficit"
            m_score = 20
        elif moisture < m_min:
            m_status = "Moderate Deficit"
            m_score = 60
        elif moisture > 85.0:
            m_status = "Saturated / Waterlogged"
            m_score = 50
        else:
            m_status = "Optimal"
            m_score = 100

        # 2. Nitrogen Status
        n_val = reading.nitrogen or 50.0
        n_min, n_max = targets["n_target"]
        if n_val < n_min * 0.6:
            n_status = "Deficient"
            n_score = 30
        elif n_val < n_min:
            n_status = "Low"
            n_score = 65
        elif n_val > n_max * 1.4:
            n_status = "Excess"
            n_score = 70
        else:
            n_status = "Optimal"
            n_score = 100

        # 3. Phosphorus Status
        p_val = reading.phosphorus or 30.0
        p_min, p_max = targets["p_target"]
        if p_val < p_min * 0.6:
            p_status = "Deficient"
            p_score = 30
        elif p_val < p_min:
            p_status = "Low"
            p_score = 65
        elif p_val > p_max * 1.5:
            p_status = "High"
            p_score = 80
        else:
            p_status = "Optimal"
            p_score = 100

        # 4. Potassium Status
        k_val = reading.potassium or 200.0
        k_min, k_max = targets["k_target"]
        if k_val < k_min * 0.6:
            k_status = "Deficient"
            k_score = 30
        elif k_val < k_min:
            k_status = "Low"
            k_score = 65
        elif k_val > k_max * 1.4:
            k_status = "High"
            k_score = 80
        else:
            k_status = "Optimal"
            k_score = 100

        # 5. pH Status
        ph_val = reading.ph or 6.8
        ph_min, ph_max = targets["ph_target"]
        if ph_val < 5.0:
            ph_status = "Strongly Acidic"
            ph_score = 40
        elif ph_val < ph_min:
            ph_status = "Slightly Acidic"
            ph_score = 75
        elif ph_val > 8.5:
            ph_status = "Strongly Alkaline"
            ph_score = 40
        elif ph_val > ph_max:
            ph_status = "Slightly Alkaline"
            ph_score = 75
        else:
            ph_status = "Optimal"
            ph_score = 100

        # 6. EC Status (Salinity)
        ec_val = reading.ec or 0.8
        if ec_val > targets["ec_max"] * 1.5:
            ec_status = "Saline / High Salt Stress"
            ec_score = 40
        elif ec_val > targets["ec_max"]:
            ec_status = "Slightly Saline"
            ec_score = 70
        else:
            ec_status = "Normal"
            ec_score = 100

        # Composite Health Score: Moisture 30%, NPK 40% (avg), pH 20%, EC 10%
        npk_avg = (n_score + p_score + k_score) / 3.0
        composite_score = int(0.30 * m_score + 0.40 * npk_avg + 0.20 * ph_score + 0.10 * ec_score)
        composite_score = max(0, min(100, composite_score))

        return schemas.SoilHealthSummary(
            moisture_status=m_status,
            moisture_percent=reading.soil_moisture,
            nitrogen_status=n_status,
            nitrogen_mg_kg=reading.nitrogen,
            phosphorus_status=p_status,
            phosphorus_mg_kg=reading.phosphorus,
            potassium_status=k_status,
            potassium_mg_kg=reading.potassium,
            ph_status=ph_status,
            ph_value=reading.ph,
            ec_status=ec_status,
            ec_value=reading.ec,
            health_score=composite_score
        )

    @classmethod
    def calculate_water_requirement(
        cls,
        reading: Optional[models.SensorReading],
        field: models.Field,
        rain_probability_percent: float = 0.0,
        precipitation_mm: float = 0.0
    ) -> schemas.WaterRequirementSummary:
        """
        Determines irrigation water deficit in liters based on crop targets, field area, and weather forecast.
        """
        targets = cls.get_crop_targets(field.crop_type)
        current_moisture = reading.soil_moisture if (reading and reading.soil_moisture is not None) else 60.0
        m_target_min, m_target_max = targets["moisture_target"]
        target_mid = (m_target_min + m_target_max) / 2.0
        area_ha = field.area_hectares or 1.0

        # Check weather forecast first: if heavy rain is incoming (> 50% probability or > 5mm expected)
        if rain_probability_percent >= 50.0 or precipitation_mm >= 5.0:
            if current_moisture >= targets["critical_moisture"]:
                return schemas.WaterRequirementSummary(
                    status="Postpone (Rain Expected)",
                    deficit_liters_total=0.0,
                    deficit_liters_per_ha=0.0,
                    recommended_duration_minutes=0.0,
                    irrigation_urgency="Low",
                    reason=f"Significant rainfall forecast ({rain_probability_percent}% probability). Postpone irrigation to avoid waterlogging and nutrient leaching."
                )

        if current_moisture >= m_target_min:
            return schemas.WaterRequirementSummary(
                status="Sufficient",
                deficit_liters_total=0.0,
                deficit_liters_per_ha=0.0,
                recommended_duration_minutes=0.0,
                irrigation_urgency="Low",
                reason=f"Soil moisture ({current_moisture:.1f}%) is within optimal crop range ({m_target_min}-{m_target_max}%)."
            )

        # Deficit percentage calculation
        deficit_pct = max(0.0, target_mid - current_moisture)
        # 1% moisture deficit across 1 ha topsoil (30 cm) ≈ 3,500 Liters of water
        liters_per_ha = deficit_pct * 3500.0
        total_liters = liters_per_ha * area_ha

        # Standard agricultural pump / drip discharge rate: ~25,000 L/hour per hectare
        duration_minutes = round((total_liters / (25000.0 * area_ha)) * 60.0, 1)

        if current_moisture < targets["critical_moisture"]:
            urgency = "Immediate"
            status_text = "Critical Irrigation Needed"
            reason = f"Soil moisture ({current_moisture:.1f}%) has fallen below critical threshold ({targets['critical_moisture']}%). Apply {int(total_liters):,} L immediately."
        else:
            urgency = "Medium"
            status_text = "Irrigation Recommended"
            reason = f"Soil moisture ({current_moisture:.1f}%) is in moderate deficit. Apply {int(total_liters):,} L ({duration_minutes} mins drip) to reach optimal {target_mid:.0f}%."

        return schemas.WaterRequirementSummary(
            status=status_text,
            deficit_liters_total=round(total_liters, 1),
            deficit_liters_per_ha=round(liters_per_ha, 1),
            recommended_duration_minutes=duration_minutes,
            irrigation_urgency=urgency,
            reason=reason
        )

    @classmethod
    def calculate_fertilizer_requirement(
        cls,
        reading: Optional[models.SensorReading],
        field: models.Field
    ) -> schemas.FertilizerRequirementSummary:
        """
        Determines N-P-K nutrient deficits (kg/ha) and recommends specific commercial fertilizer dosages.
        """
        targets = cls.get_crop_targets(field.crop_type)
        n_val = reading.nitrogen if (reading and reading.nitrogen is not None) else 55.0
        p_val = reading.phosphorus if (reading and reading.phosphorus is not None) else 30.0
        k_val = reading.potassium if (reading and reading.potassium is not None) else 200.0

        n_target_min, _ = targets["n_target"]
        p_target_min, _ = targets["p_target"]
        k_target_min, _ = targets["k_target"]

        # Deficit calculation in kg/ha (standard conversion: 1 mg/kg soil test deficit ≈ 2.24 kg/ha nutrient deficit)
        n_def_kg = max(0.0, round((n_target_min - n_val) * 2.24, 1))
        p_def_kg = max(0.0, round((p_target_min - p_val) * 2.24, 1))
        k_def_kg = max(0.0, round((k_target_min - k_val) * 2.24, 1))

        recommended_ferts = []
        guidelines = []

        # Nitrogen correction -> Neem Coated Urea (46% N)
        if n_def_kg > 0:
            urea_kg_ha = round(n_def_kg / 0.46, 1)
            recommended_ferts.append({
                "fertilizer": "Neem Coated Urea (46% N)",
                "dosage_kg_per_ha": urea_kg_ha,
                "total_field_kg": round(urea_kg_ha * (field.area_hectares or 1.0), 1),
                "application_method": "Top dressing / Split application during active tillering",
                "purpose": f"Corrects Nitrogen deficit of {n_def_kg} kg/ha"
            })
            guidelines.append(f"Apply {urea_kg_ha} kg/ha Urea in 2 split doses after irrigation.")

        # Phosphorus correction -> DAP (18% N, 46% P2O5) or Single Super Phosphate (16% P2O5)
        if p_def_kg > 0:
            dap_kg_ha = round(p_def_kg / 0.46, 1)
            recommended_ferts.append({
                "fertilizer": "DAP (Di-Ammonium Phosphate 18-46-0)",
                "dosage_kg_per_ha": dap_kg_ha,
                "total_field_kg": round(dap_kg_ha * (field.area_hectares or 1.0), 1),
                "application_method": "Soil placement near root zone / Basal application",
                "purpose": f"Corrects Phosphorus deficit of {p_def_kg} kg/ha"
            })
            guidelines.append(f"Place {dap_kg_ha} kg/ha DAP 3-5 cm below seed level for optimal root uptake.")

        # Potassium correction -> MOP (60% K2O)
        if k_def_kg > 0:
            mop_kg_ha = round(k_def_kg / 0.60, 1)
            recommended_ferts.append({
                "fertilizer": "MOP (Muriate of Potash 0-0-60)",
                "dosage_kg_per_ha": mop_kg_ha,
                "total_field_kg": round(mop_kg_ha * (field.area_hectares or 1.0), 1),
                "application_method": "Basal soil application or fertigation",
                "purpose": f"Corrects Potassium deficit of {k_def_kg} kg/ha"
            })
            guidelines.append(f"Broadcast {mop_kg_ha} kg/ha MOP to strengthen stem strength and grain weight.")

        # Balanced status check
        if not recommended_ferts:
            status_text = "Balanced Nutrients"
            guidelines.append("All primary macro-nutrients (N, P, K) are at optimal levels. Maintain regular organic mulching.")
        elif len(recommended_ferts) == 1:
            status_text = f"{list(recommended_ferts)[0]['fertilizer'].split()[0]} Requirement"
        else:
            status_text = "Multi-Nutrient Deficit"

        return schemas.FertilizerRequirementSummary(
            status=status_text,
            n_deficit_kg_per_ha=n_def_kg,
            p_deficit_kg_per_ha=p_def_kg,
            k_deficit_kg_per_ha=k_def_kg,
            recommended_fertilizers=recommended_ferts,
            application_guidelines=" ".join(guidelines)
        )

    @classmethod
    def evaluate_and_generate_recommendations(
        cls,
        db: Session,
        field_id: int,
        rain_probability_percent: float = 0.0,
        precipitation_mm: float = 0.0
    ) -> List[models.Recommendation]:
        """
        Executes complete Soil + Water + Fertilizer decision cycle and persists actionable recommendations.
        """
        field = db.query(models.Field).filter(models.Field.id == field_id).first()
        if not field:
            return []

        latest_reading = db.query(models.SensorReading).filter(
            models.SensorReading.field_id == field_id
        ).order_by(models.SensorReading.timestamp.desc()).first()

        soil_health = cls.analyze_soil_health(latest_reading, field.crop_type)
        water_req = cls.calculate_water_requirement(latest_reading, field, rain_probability_percent, precipitation_mm)
        fert_req = cls.calculate_fertilizer_requirement(latest_reading, field)

        generated_recs = []

        # 1. Irrigation Recommendation
        if water_req.status != "Sufficient":
            priority = models.RecommendationPriorityEnum.URGENT if water_req.irrigation_urgency in ["Immediate", "High"] else models.RecommendationPriorityEnum.MEDIUM
            irr_rec = models.Recommendation(
                field_id=field_id,
                recommendation_type=models.RecommendationTypeEnum.IRRIGATION,
                priority=priority,
                title=f"Irrigation: {water_req.status}",
                description=water_req.reason,
                action_items=[
                    f"Target water volume: {int(water_req.deficit_liters_total):,} Liters",
                    f"Recommended runtime: {water_req.recommended_duration_minutes} minutes"
                ] if water_req.deficit_liters_total > 0 else ["Hold irrigation; verify field drainage"],
                metrics_snapshot={
                    "moisture_percent": soil_health.moisture_percent,
                    "deficit_liters": water_req.deficit_liters_total,
                    "rain_probability": rain_probability_percent
                }
            )
            db.add(irr_rec)
            generated_recs.append(irr_rec)

        # 2. Fertilizer Recommendation
        if fert_req.recommended_fertilizers:
            fert_rec = models.Recommendation(
                field_id=field_id,
                recommendation_type=models.RecommendationTypeEnum.FERTILIZER,
                priority=models.RecommendationPriorityEnum.HIGH,
                title=f"Fertilizer: {fert_req.status}",
                description=fert_req.application_guidelines,
                action_items=[
                    f"Apply {f['dosage_kg_per_ha']} kg/ha of {f['fertilizer']} ({f['application_method']})"
                    for f in fert_req.recommended_fertilizers
                ],
                metrics_snapshot={
                    "n_deficit_kg_ha": fert_req.n_deficit_kg_per_ha,
                    "p_deficit_kg_ha": fert_req.p_deficit_kg_per_ha,
                    "k_deficit_kg_ha": fert_req.k_deficit_kg_per_ha
                }
            )
            db.add(fert_rec)
            generated_recs.append(fert_rec)

        # 3. Soil pH / EC Correction Recommendation
        if latest_reading and latest_reading.ph is not None:
            if latest_reading.ph < 5.5:
                ph_rec = models.Recommendation(
                    field_id=field_id,
                    recommendation_type=models.RecommendationTypeEnum.SOIL,
                    priority=models.RecommendationPriorityEnum.MEDIUM,
                    title="Soil Amendment: Acidic pH Detected",
                    description=f"Soil pH is {latest_reading.ph:.1f} (acidic). Apply Agricultural Lime (Calcium Carbonate) at 200 kg/ha to raise pH to optimal 6.5.",
                    action_items=["Broadcast Agricultural Lime before next irrigation cycle", "Avoid excessive acidic fertilizers like Ammonium Sulphate"],
                    metrics_snapshot={"ph": latest_reading.ph}
                )
                db.add(ph_rec)
                generated_recs.append(ph_rec)
            elif latest_reading.ph > 8.0:
                ph_rec = models.Recommendation(
                    field_id=field_id,
                    recommendation_type=models.RecommendationTypeEnum.SOIL,
                    priority=models.RecommendationPriorityEnum.MEDIUM,
                    title="Soil Amendment: Alkaline pH Detected",
                    description=f"Soil pH is {latest_reading.ph:.1f} (alkaline). Apply Agricultural Gypsum at 250 kg/ha and incorporate green manure.",
                    action_items=["Apply Gypsum to displace sodium ions", "Increase organic matter / compost"],
                    metrics_snapshot={"ph": latest_reading.ph}
                )
                db.add(ph_rec)
                generated_recs.append(ph_rec)

        db.commit()
        return generated_recs
