from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, JSON, Text, Enum as SQLEnum, Index
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database import Base

class DeviceTypeEnum(str, enum.Enum):
    NPK_7IN1 = "NPK_7IN1"
    STANDALONE_PH = "STANDALONE_PH"
    WEATHER_STATION = "WEATHER_STATION"

class AlertTypeEnum(str, enum.Enum):
    LOW_MOISTURE = "LOW_MOISTURE"
    NUTRIENT_DEFICIENCY = "NUTRIENT_DEFICIENCY"
    HIGH_TEMPERATURE = "HIGH_TEMPERATURE"
    HEAVY_RAIN = "HEAVY_RAIN"
    SENSOR_DISCONNECTED = "SENSOR_DISCONNECTED"
    LORA_DISCONNECTED = "LORA_DISCONNECTED"
    ABNORMAL_READING = "ABNORMAL_READING"
    GENERAL = "GENERAL"

class SeverityEnum(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class RecommendationTypeEnum(str, enum.Enum):
    SOIL = "SOIL"
    IRRIGATION = "IRRIGATION"
    FERTILIZER = "FERTILIZER"
    WEATHER = "WEATHER"
    GENERAL = "GENERAL"

class RecommendationPriorityEnum(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    URGENT = "URGENT"

class ValveTypeEnum(str, enum.Enum):
    IRRIGATION = "IRRIGATION"
    FERTILIZER = "FERTILIZER"

class ValveStateEnum(str, enum.Enum):
    OPEN = "OPEN"
    CLOSED = "CLOSED"

class HardwareModeEnum(str, enum.Enum):
    REAL_HARDWARE = "REAL_HARDWARE"
    SIMULATION = "SIMULATION"

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    failed_login_attempts = Column(Integer, default=0)
    locked_until = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    fields = relationship("Field", back_populates="owner")


class Field(Base):
    __tablename__ = 'fields'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String)
    crop_type = Column(String)
    area_hectares = Column(Float)
    soil_type = Column(String)
    owner_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User", back_populates="fields")
    sensor_devices = relationship("SensorDevice", back_populates="field", cascade="all, delete-orphan")
    sensor_readings = relationship("SensorReading", back_populates="field", cascade="all, delete-orphan")
    water_usages = relationship("WaterUsage", back_populates="field", cascade="all, delete-orphan")
    fertilizer_usages = relationship("FertilizerUsage", back_populates="field", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="field", cascade="all, delete-orphan")
    valves = relationship("Valve", back_populates="field", cascade="all, delete-orphan")
    irrigation_systems = relationship("IrrigationSystem", back_populates="field", cascade="all, delete-orphan")
    weather_data = relationship("WeatherData", back_populates="field", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="field", cascade="all, delete-orphan")


class SensorDevice(Base):
    __tablename__ = 'sensor_devices'
    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String, unique=True, index=True, nullable=False)
    field_id = Column(Integer, ForeignKey('fields.id'), nullable=False)
    device_type = Column(SQLEnum(DeviceTypeEnum), nullable=False)
    lora_node_id = Column(String)
    lora_gateway_id = Column(String)
    is_active = Column(Boolean, default=True)
    last_seen = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    field = relationship("Field", back_populates="sensor_devices")
    readings = relationship("SensorReading", back_populates="device", cascade="all, delete-orphan")


class SensorReading(Base):
    __tablename__ = 'sensor_readings'
    id = Column(Integer, primary_key=True, index=True)
    field_id = Column(Integer, ForeignKey('fields.id'), nullable=False)
    device_id = Column(Integer, ForeignKey('sensor_devices.id'), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    nitrogen = Column(Float, nullable=True)
    phosphorus = Column(Float, nullable=True)
    potassium = Column(Float, nullable=True)
    ph = Column(Float, nullable=True)
    ec = Column(Float, nullable=True)
    soil_moisture = Column(Float, nullable=True)
    soil_temperature = Column(Float, nullable=True)
    raw_payload = Column(JSON, nullable=True)

    field = relationship("Field", back_populates="sensor_readings")
    device = relationship("SensorDevice", back_populates="readings")

    __table_args__ = (
        Index('ix_reading_field_timestamp', 'field_id', 'timestamp'),
        Index('ix_reading_device_timestamp', 'device_id', 'timestamp'),
    )


class WeatherData(Base):
    __tablename__ = 'weather_data'
    id = Column(Integer, primary_key=True, index=True)
    field_id = Column(Integer, ForeignKey('fields.id'), nullable=True)
    location = Column(String, nullable=False, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    temperature = Column(Float, nullable=False)
    humidity = Column(Float, nullable=False)
    rain_probability = Column(Float, default=0.0)
    precipitation_mm = Column(Float, default=0.0)
    wind_speed = Column(Float, default=0.0)
    condition = Column(String, default="Clear")
    source = Column(String, default="OpenWeatherMap")
    raw_data = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    field = relationship("Field", back_populates="weather_data")

    __table_args__ = (
        Index('ix_weather_field_timestamp', 'field_id', 'timestamp'),
    )


class Recommendation(Base):
    __tablename__ = 'recommendations'
    id = Column(Integer, primary_key=True, index=True)
    field_id = Column(Integer, ForeignKey('fields.id'), nullable=False)
    recommendation_type = Column(SQLEnum(RecommendationTypeEnum), nullable=False)
    priority = Column(SQLEnum(RecommendationPriorityEnum), default=RecommendationPriorityEnum.MEDIUM, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    action_items = Column(JSON, nullable=True) # List of specific actions
    metrics_snapshot = Column(JSON, nullable=True) # NPK, moisture, weather snapshot at generation
    is_applied = Column(Boolean, default=False)
    applied_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    field = relationship("Field", back_populates="recommendations")

    __table_args__ = (
        Index('ix_rec_field_created', 'field_id', 'created_at'),
    )


class CropPrice(Base):
    __tablename__ = 'crop_prices'
    id = Column(Integer, primary_key=True, index=True)
    crop = Column(String, nullable=False, index=True)
    mandi_name = Column(String, nullable=False)
    state = Column(String, nullable=False, index=True)
    district = Column(String, nullable=True)
    modal_price_per_quintal = Column(Float, nullable=False)
    min_price_per_quintal = Column(Float, nullable=True)
    max_price_per_quintal = Column(Float, nullable=True)
    arrival_volume_quintals = Column(Float, nullable=True)
    distance_km = Column(Float, nullable=True)
    source = Column(String, default="eNAM / Agmarknet")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        Index('ix_crop_price_crop_state', 'crop', 'state'),
    )


class FertilizerCatalog(Base):
    __tablename__ = 'fertilizer_catalog'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    brand = Column(String, nullable=True)
    nitrogen_percent = Column(Float, default=0.0)
    phosphorus_percent = Column(Float, default=0.0)
    potassium_percent = Column(Float, default=0.0)
    package_size_kg = Column(Float, default=50.0)
    price_inr = Column(Float, nullable=False)
    application_stage = Column(String, nullable=True)
    suitability = Column(Text, nullable=True)
    is_available = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=datetime.utcnow)


class WaterUsage(Base):
    __tablename__ = 'water_usages'
    id = Column(Integer, primary_key=True, index=True)
    field_id = Column(Integer, ForeignKey('fields.id'), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    amount_liters = Column(Float, nullable=False)
    duration_minutes = Column(Float, nullable=True)
    irrigation_type = Column(String)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    field = relationship("Field", back_populates="water_usages")


class FertilizerUsage(Base):
    __tablename__ = 'fertilizer_usages'
    id = Column(Integer, primary_key=True, index=True)
    field_id = Column(Integer, ForeignKey('fields.id'), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    fertilizer_type = Column(String, nullable=False)
    amount_kg = Column(Float, nullable=False)
    nitrogen_content = Column(Float, nullable=True)
    phosphorus_content = Column(Float, nullable=True)
    potassium_content = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    field = relationship("Field", back_populates="fertilizer_usages")


class Alert(Base):
    __tablename__ = 'alerts'
    id = Column(Integer, primary_key=True, index=True)
    field_id = Column(Integer, ForeignKey('fields.id'), nullable=False)
    alert_type = Column(SQLEnum(AlertTypeEnum), nullable=False)
    severity = Column(SQLEnum(SeverityEnum), nullable=False)
    message = Column(Text, nullable=False)
    is_resolved = Column(Boolean, default=False)
    resolved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    field = relationship("Field", back_populates="alerts")


class Valve(Base):
    __tablename__ = 'valves'
    id = Column(Integer, primary_key=True, index=True)
    valve_id = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    valve_type = Column(SQLEnum(ValveTypeEnum), nullable=False)
    zone = Column(String, nullable=False)
    field_id = Column(Integer, ForeignKey('fields.id'), nullable=False)
    state = Column(SQLEnum(ValveStateEnum), default=ValveStateEnum.CLOSED, nullable=False)
    is_connected = Column(Boolean, default=True)
    hardware_mode = Column(SQLEnum(HardwareModeEnum), default=HardwareModeEnum.SIMULATION)
    last_changed_at = Column(DateTime, default=datetime.utcnow)
    last_changed_by = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    field = relationship("Field", back_populates="valves")


class IrrigationSystem(Base):
    __tablename__ = 'irrigation_systems'
    id = Column(Integer, primary_key=True, index=True)
    field_id = Column(Integer, ForeignKey('fields.id'), unique=True, nullable=False)
    system_state = Column(String, default="OFF", nullable=False) # ON / OFF
    hardware_mode = Column(SQLEnum(HardwareModeEnum), default=HardwareModeEnum.SIMULATION)
    is_connected = Column(Boolean, default=True)
    active_zone = Column(String, nullable=True)
    last_operation = Column(String, default="System Initialized")
    last_updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    field = relationship("Field", back_populates="irrigation_systems")


class CommandLog(Base):
    __tablename__ = 'command_logs'
    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, nullable=False)
    target_type = Column(String, nullable=False) # IRRIGATION / VALVE
    target_id = Column(String, nullable=False)
    action = Column(String, nullable=False) # ON / OFF / OPEN / CLOSE
    status = Column(String, nullable=False) # SUCCESS / FAILED
    detail = Column(Text, nullable=True)
    hardware_mode = Column(String, default="SIMULATION")
    timestamp = Column(DateTime, default=datetime.utcnow)

