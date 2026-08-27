from pydantic import BaseModel, EmailStr, Field as PydanticField, field_validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.models import (
    DeviceTypeEnum, AlertTypeEnum, SeverityEnum, 
    ValveTypeEnum, ValveStateEnum, HardwareModeEnum,
    RecommendationTypeEnum, RecommendationPriorityEnum
)
import re

# Auth Schemas
class Token(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str

    @field_validator('password')
    @classmethod
    def validate_password_strength(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'[0-9]', v):
            raise ValueError('Password must contain at least one number')
        if not re.search(r'[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?`~]', v):
            raise ValueError('Password must contain at least one special character (!@#$%^&* etc.)')
        
        common_passwords = {
            'password', 'password123', '123456', '12345678', 'qwerty', 'abc123',
            'letmein', 'monkey', 'dragon', 'master', 'sunshine', 'princess',
            'welcome', 'shadow', 'superman', 'baseball', 'iloveyou', 'trustno1',
            'login', 'admin', 'hello', 'hello123', 'test123', 'user123'
        }
        if v.lower() in common_passwords:
            raise ValueError('Password is too common. Please choose a more secure password.')
            
        if re.search(r'(.)\1{2,}', v):
            raise ValueError('Password contains too many repeated consecutive characters')
            
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Field Schemas
class FieldCreate(BaseModel):
    name: str
    location: Optional[str] = None
    crop_type: Optional[str] = None
    area_hectares: Optional[float] = None
    soil_type: Optional[str] = None

class FieldUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    crop_type: Optional[str] = None
    area_hectares: Optional[float] = None
    soil_type: Optional[str] = None

class FieldResponse(BaseModel):
    id: int
    name: str
    location: Optional[str]
    crop_type: Optional[str]
    area_hectares: Optional[float]
    soil_type: Optional[str]
    owner_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Device Schemas
class SensorDeviceCreate(BaseModel):
    device_id: str
    field_id: int
    device_type: DeviceTypeEnum
    lora_node_id: Optional[str] = None
    lora_gateway_id: Optional[str] = None

class SensorDeviceResponse(BaseModel):
    id: int
    device_id: str
    field_id: int
    device_type: DeviceTypeEnum
    lora_node_id: Optional[str]
    lora_gateway_id: Optional[str]
    is_active: bool
    last_seen: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True

# Sensor Reading Schemas
class SensorReadingCreate(BaseModel):
    device_id: str
    nitrogen: Optional[float] = None
    phosphorus: Optional[float] = None
    potassium: Optional[float] = None
    ph: Optional[float] = None
    ec: Optional[float] = None
    soil_moisture: Optional[float] = None
    soil_temperature: Optional[float] = None

class SensorReadingResponse(BaseModel):
    id: int
    field_id: int
    device_id: int
    timestamp: datetime
    nitrogen: Optional[float]
    phosphorus: Optional[float]
    potassium: Optional[float]
    ph: Optional[float]
    ec: Optional[float]
    soil_moisture: Optional[float]
    soil_temperature: Optional[float]

    class Config:
        from_attributes = True

class LoRaUplinkPayload(BaseModel):
    timestamp: Optional[str] = None
    device_model: Optional[str] = None
    payload: Dict[str, Any]

    @field_validator('payload')
    def check_payload_ranges(cls, v):
        if 'nitrogen' in v and v['nitrogen'] is not None and not (0 <= v['nitrogen'] <= 9999):
            raise ValueError("Nitrogen out of bounds")
        if 'ph' in v and v['ph'] is not None and not (0 <= v['ph'] <= 14):
            raise ValueError("pH out of bounds")
        if 'soil_moisture' in v and v['soil_moisture'] is not None and not (0 <= v['soil_moisture'] <= 100):
            raise ValueError("Moisture out of bounds")
        if 'soil_temperature' in v and v['soil_temperature'] is not None and not (-50 <= v['soil_temperature'] <= 100):
            raise ValueError("Temperature out of bounds")
        return v

# Water Usage Schemas
class WaterUsageCreate(BaseModel):
    field_id: int
    amount_liters: float = PydanticField(..., gt=0)
    duration_minutes: Optional[float] = None
    irrigation_type: str
    notes: Optional[str] = None

class WaterUsageResponse(BaseModel):
    id: int
    field_id: int
    timestamp: datetime
    amount_liters: float
    duration_minutes: Optional[float]
    irrigation_type: str
    notes: Optional[str]

    class Config:
        from_attributes = True

# Fertilizer Usage Schemas
class FertilizerUsageCreate(BaseModel):
    field_id: int
    fertilizer_type: str
    amount_kg: float = PydanticField(..., gt=0)
    nitrogen_content: Optional[float] = None
    phosphorus_content: Optional[float] = None
    potassium_content: Optional[float] = None
    notes: Optional[str] = None

class FertilizerUsageResponse(BaseModel):
    id: int
    field_id: int
    timestamp: datetime
    fertilizer_type: str
    amount_kg: float
    nitrogen_content: Optional[float]
    phosphorus_content: Optional[float]
    potassium_content: Optional[float]
    notes: Optional[str]

    class Config:
        from_attributes = True

# Alert Schemas
class AlertResponse(BaseModel):
    id: int
    field_id: int
    alert_type: AlertTypeEnum
    severity: SeverityEnum
    message: str
    is_resolved: bool
    resolved_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True

# Chat Schemas
class ChatRequest(BaseModel):
    message: str
    field_id: Optional[int] = None

class ChatResponse(BaseModel):
    reply: str

# Dashboard & Weather Schemas
class DashboardResponse(BaseModel):
    field_info: FieldResponse
    latest_readings: Optional[SensorReadingResponse]
    recent_alerts: List[AlertResponse]
    water_stats: Dict[str, Any]
    fertilizer_stats: Dict[str, Any]
    weather: Dict[str, Any]

class WeatherResponse(BaseModel):
    temperature: float
    humidity: float
    rain_probability: float
    wind_speed: float
    description: str
    forecast: List[Dict[str, Any]]
    source: str

# Valve & Hardware Schemas
class ValveResponse(BaseModel):
    id: int
    valve_id: str
    name: str
    valve_type: ValveTypeEnum
    zone: str
    field_id: int
    state: ValveStateEnum
    is_connected: bool
    hardware_mode: HardwareModeEnum
    last_changed_at: datetime
    last_changed_by: Optional[str] = None

    class Config:
        from_attributes = True

class ValveActionResponse(BaseModel):
    success: bool
    message: str
    valve: ValveResponse
    hardware_mode: HardwareModeEnum

class IrrigationStatusResponse(BaseModel):
    field_id: int
    system_state: str # ON / OFF
    hardware_mode: HardwareModeEnum
    is_connected: bool
    active_zone: Optional[str] = None
    last_operation: str
    last_updated_at: datetime

    class Config:
        from_attributes = True

class IrrigationControlRequest(BaseModel):
    field_id: int
    zone: Optional[str] = None
    notes: Optional[str] = None

class IrrigationActionResponse(BaseModel):
    success: bool
    message: str
    system_status: IrrigationStatusResponse
    hardware_mode: HardwareModeEnum

class CommandLogResponse(BaseModel):
    id: int
    user_email: str
    target_type: str
    target_id: str
    action: str
    status: str
    detail: Optional[str] = None
    hardware_mode: str
    timestamp: datetime

    class Config:
        from_attributes = True

# Pipeline Specific Schemas

class SensorIngestRequest(BaseModel):
    device_id: str
    nitrogen: Optional[float] = PydanticField(None, ge=0, le=9999)
    phosphorus: Optional[float] = PydanticField(None, ge=0, le=9999)
    potassium: Optional[float] = PydanticField(None, ge=0, le=9999)
    ph: Optional[float] = PydanticField(None, ge=0, le=14)
    ec: Optional[float] = PydanticField(None, ge=0, le=100)
    soil_moisture: Optional[float] = PydanticField(None, ge=0, le=100)
    soil_temperature: Optional[float] = PydanticField(None, ge=-50, le=100)
    timestamp: Optional[datetime] = None
    raw_payload: Optional[Dict[str, Any]] = None

class SensorIngestResponse(BaseModel):
    success: bool
    message: str
    reading_id: int
    field_id: int
    device_id: str
    timestamp: datetime
    alerts_triggered: int = 0

class RecommendationResponse(BaseModel):
    id: int
    field_id: int
    recommendation_type: RecommendationTypeEnum
    priority: RecommendationPriorityEnum
    title: str
    description: str
    action_items: Optional[List[str]] = None
    metrics_snapshot: Optional[Dict[str, Any]] = None
    is_applied: bool
    applied_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

class RecommendationApplyRequest(BaseModel):
    notes: Optional[str] = None

class SoilHealthSummary(BaseModel):
    moisture_status: str # Saturated, Optimal, Moderate Deficit, Critical Deficit
    moisture_percent: Optional[float]
    nitrogen_status: str # High, Optimal, Low, Deficient
    nitrogen_mg_kg: Optional[float]
    phosphorus_status: str
    phosphorus_mg_kg: Optional[float]
    potassium_status: str
    potassium_mg_kg: Optional[float]
    ph_status: str # Strongly Acidic, Slightly Acidic, Optimal, Alkaline
    ph_value: Optional[float]
    ec_status: str # Normal, Slightly Saline, Saline
    ec_value: Optional[float]
    health_score: int # 0 - 100

class WaterRequirementSummary(BaseModel):
    status: str # Irrigation Needed, Sufficient, Postpone (Rain Expected)
    deficit_liters_total: float
    deficit_liters_per_ha: float
    recommended_duration_minutes: float
    irrigation_urgency: str # Low, Medium, High, Immediate
    reason: str

class FertilizerRequirementSummary(BaseModel):
    status: str # Balanced, N Deficit, P Deficit, K Deficit, Multi-Nutrient Deficit
    n_deficit_kg_per_ha: float
    p_deficit_kg_per_ha: float
    k_deficit_kg_per_ha: float
    recommended_fertilizers: List[Dict[str, Any]]
    application_guidelines: str

class FieldStatusResponse(BaseModel):
    field_id: int
    field_name: str
    crop_type: str
    area_hectares: float
    location: str
    soil_type: str
    last_sensor_reading: Optional[SensorReadingResponse] = None
    soil_health: SoilHealthSummary
    water_requirement: WaterRequirementSummary
    fertilizer_requirement: FertilizerRequirementSummary
    weather_summary: Dict[str, Any]
    active_alerts: List[AlertResponse]
    active_recommendations: List[RecommendationResponse]

class CropPriceItem(BaseModel):
    crop: str
    mandi_name: str
    state: str
    district: Optional[str] = None
    modal_price_per_quintal: float
    min_price_per_quintal: Optional[float] = None
    max_price_per_quintal: Optional[float] = None
    arrival_volume_quintals: Optional[float] = None
    distance_km: Optional[float] = None
    source: str = "eNAM / Agmarknet"
    updated_at: Optional[datetime] = None

class CropPriceCompareResponse(BaseModel):
    crop: str
    timestamp: str
    primary_mandi: CropPriceItem
    nearby_mandis: List[CropPriceItem]
    best_market: str
    arbitrage_potential_inr_per_quintal: float
    advice: str

class FertilizerCatalogItem(BaseModel):
    id: int
    name: str
    brand: Optional[str] = None
    nitrogen_percent: float
    phosphorus_percent: float
    potassium_percent: float
    package_size_kg: float
    price_inr: float
    application_stage: Optional[str] = None
    suitability: Optional[str] = None

    class Config:
        from_attributes = True

class FertilizerComparisonItem(BaseModel):
    fertilizer_name: str
    brand: Optional[str] = None
    npk_ratio: str
    price_per_bag_inr: float
    cost_per_kg_n: Optional[float] = None
    cost_per_kg_p: Optional[float] = None
    cost_per_kg_k: Optional[float] = None
    cost_per_nutrient_kg_avg: float
    suitability: str
    rank: int

class FertilizerRankRequest(BaseModel):
    crop: Optional[str] = "Wheat"
    field_id: Optional[int] = None
    target_nutrients: Optional[List[str]] = ["N", "P", "K"]

class FertilizerRankResponse(BaseModel):
    crop: str
    field_id: Optional[int]
    detected_deficiency: Dict[str, str]
    ranked_fertilizers: List[FertilizerComparisonItem]
    top_recommendation: str

class WeatherDecisionResponse(BaseModel):
    location: str
    timestamp: str
    temperature_celsius: float
    humidity_percent: float
    rain_probability_percent: float
    precipitation_expected_mm: float
    wind_speed_kmh: float
    condition: str
    forecast: List[Dict[str, Any]]
    irrigation_advisory: str
    fertilizer_spray_advisory: str
    heat_stress_advisory: str
    source: str

