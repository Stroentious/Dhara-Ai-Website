import sys
import os

# Ensure backend root is always on sys.path regardless of execution CWD
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

import logging
from contextlib import asynccontextmanager

from app.database import engine, Base, SessionLocal
from app.config import settings
from app import models, auth as auth_service
from app.routes import auth, fields, sensors, lora, water, fertilizer, weather, dashboard, alerts, chat, health, irrigation, valves, recommendations, crops
from app.routes.auth import limiter

logger = logging.getLogger(__name__)


from sqlalchemy import inspect, text

@asynccontextmanager
async def lifespan(app_instance):
    """Create DB tables and safely run lightweight schema migrations on startup."""
    try:
        Base.metadata.create_all(bind=engine)
        
        # Lightweight schema migration for SQLite
        try:
            with engine.connect() as conn:
                inspector = inspect(engine)
                if "users" in inspector.get_table_names():
                    user_cols = [c["name"] for c in inspector.get_columns("users")]
                    if "failed_login_attempts" not in user_cols:
                        conn.execute(text("ALTER TABLE users ADD COLUMN failed_login_attempts INTEGER DEFAULT 0"))
                    if "locked_until" not in user_cols:
                        conn.execute(text("ALTER TABLE users ADD COLUMN locked_until DATETIME NULL"))
                    conn.commit()
        except Exception as mig_err:
            logger.warning(f"Auto-migration check note: {mig_err}")

        # Ensure default demo user and initial field exist
        from app.database import SessionLocal
        from app import auth as auth_service
        with SessionLocal() as db:
            default_user = db.query(models.User).filter(models.User.email == "farmer@dhara.ai").first()
            if not default_user:
                default_user = models.User(
                    email="farmer@dhara.ai",
                    hashed_password=auth_service.get_password_hash("Dhara@AI2026!Secure"),
                    full_name="Dr. Ramesh Sharma (Farmer)"
                )
                db.add(default_user)
                db.commit()
                db.refresh(default_user)
                logger.info("Default user 'farmer@dhara.ai' initialized.")

            # Ensure default user has at least one field
            user_field = db.query(models.Field).filter(models.Field.owner_id == default_user.id).first()
            if not user_field:
                user_field = models.Field(
                    name="North Wheat Field (Plot 4A)",
                    crop_type="Wheat (PBW 550)",
                    soil_type="Alluvial Loam",
                    area_hectares=2.5,
                    location="Karnal, Haryana",
                    owner_id=default_user.id
                )
                db.add(user_field)
                db.commit()
                db.refresh(user_field)
                logger.info("Default field initialized for farmer@dhara.ai.")

            # Ensure default field has a registered 7-in-1 NPK sensor device
            default_device = db.query(models.SensorDevice).filter(models.SensorDevice.field_id == user_field.id).first()
            if not default_device:
                default_device = models.SensorDevice(
                    device_id="NPK7IN1-DEV-001",
                    field_id=user_field.id,
                    device_type=models.DeviceTypeEnum.NPK_7IN1,
                    lora_node_id="LORA-NODE-01",
                    lora_gateway_id="LORA-GW-KARNAL-01",
                    is_active=True
                )
                db.add(default_device)
                db.commit()
                logger.info("Default sensor device NPK7IN1-DEV-001 initialized.")

            # Seed standard fertilizer catalog if empty
            if db.query(models.FertilizerCatalog).count() == 0:
                standard_ferts = [
                    models.FertilizerCatalog(name="Neem Coated Urea (46-0-0)", brand="IFFCO", nitrogen_percent=46.0, phosphorus_percent=0.0, potassium_percent=0.0, package_size_kg=45.0, price_inr=266.0, application_stage="Vegetative / Tillering", suitability="High nitrogen source for vigorous vegetative growth."),
                    models.FertilizerCatalog(name="DAP (Di-Ammonium Phosphate 18-46-0)", brand="IFFCO", nitrogen_percent=18.0, phosphorus_percent=46.0, potassium_percent=0.0, package_size_kg=50.0, price_inr=1350.0, application_stage="Basal / Sowing", suitability="High phosphorus for strong root establishment and early vigor."),
                    models.FertilizerCatalog(name="MOP (Muriate of Potash 0-0-60)", brand="IPL", nitrogen_percent=0.0, phosphorus_percent=0.0, potassium_percent=60.0, package_size_kg=50.0, price_inr=1700.0, application_stage="Basal & Heading", suitability="High potassium for disease resistance, drought tolerance, and grain filling."),
                    models.FertilizerCatalog(name="NPK Complex (12-32-16)", brand="Gromor", nitrogen_percent=12.0, phosphorus_percent=32.0, potassium_percent=16.0, package_size_kg=50.0, price_inr=1470.0, application_stage="Basal application", suitability="Balanced macro-nutrients ideal for alluvial soils and cereal crops."),
                    models.FertilizerCatalog(name="NPK Complex (10-26-26)", brand="IFFCO", nitrogen_percent=10.0, phosphorus_percent=26.0, potassium_percent=26.0, package_size_kg=50.0, price_inr=1470.0, application_stage="Basal & Crown Root Initiation", suitability="High PK ratio for crops requiring robust root and grain development."),
                    models.FertilizerCatalog(name="NPK (20-20-20) Water Soluble", brand="Mahadhan", nitrogen_percent=20.0, phosphorus_percent=20.0, potassium_percent=20.0, package_size_kg=25.0, price_inr=1550.0, application_stage="Foliar / Fertigation", suitability="Equal ratio water-soluble fertilizer for rapid nutrient uptake through fertigation.")
                ]
                db.add_all(standard_ferts)
                db.commit()
                logger.info("Standard fertilizer catalog seeded.")

        logger.info("Database tables & schema verified successfully.")
    except Exception as e:
        logger.warning(f"Could not connect to database on startup: {e}.")
    yield
    # Cleanup on shutdown if needed

app = FastAPI(
    title="DHARA AI Backend",
    version="1.0.0",
    description="Backend API for DHARA AI Agricultural IoT Platform",
    lifespan=lifespan
)

# Rate Limiter setup
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# Security Headers Middleware
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response

app.add_middleware(SecurityHeadersMiddleware)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handlers
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled error during request {request.method} {request.url.path}: {exc}")
    return Response(
        content='{"detail": "Internal server error"}', 
        status_code=500, 
        media_type="application/json"
    )


# Include Routers
app.include_router(auth.router, prefix="/api")
app.include_router(fields.router, prefix="/api")
app.include_router(sensors.router, prefix="/api")
app.include_router(lora.router, prefix="/api")
app.include_router(water.router, prefix="/api")
app.include_router(fertilizer.router, prefix="/api")
app.include_router(weather.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(alerts.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(health.router, prefix="/api")
app.include_router(irrigation.router, prefix="/api")
app.include_router(valves.router, prefix="/api")
app.include_router(recommendations.router, prefix="/api")
app.include_router(crops.router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
