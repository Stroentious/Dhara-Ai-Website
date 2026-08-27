"""
Weather to Field Decision Pipeline
==================================
Pipeline 3: Weather API → Validate/Normalize → In-Memory Cache (TTL) + DB Store → Agronomic Impact Decision Engine → Dashboard + DHARA AI.
"""

from typing import Dict, Any, Optional, Tuple
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from cachetools import TTLCache
import httpx
import logging

from app import models, schemas
from app.config import settings
from app.mock_data import generate_mock_weather

logger = logging.getLogger(__name__)

# In-memory TTL cache: 10 minutes (600 seconds)
weather_pipeline_cache = TTLCache(maxsize=200, ttl=600)

class WeatherDecisionPipeline:
    """
    Fetches live weather or simulation, normalizes & caches it, stores in DB, and generates agronomic advisories.
    """

    @classmethod
    async def fetch_weather(
        cls,
        location: str = "Karnal, Haryana",
        lat: Optional[float] = None,
        lon: Optional[float] = None,
        db: Optional[Session] = None,
        field_id: Optional[int] = None
    ) -> schemas.WeatherDecisionResponse:
        """
        Fetches, caches, stores, and analyzes weather conditions for agricultural decisions.
        """
        cache_key = f"{location}:{lat}:{lon}"
        if cache_key in weather_pipeline_cache:
            return weather_pipeline_cache[cache_key]

        weather_raw = None
        source_name = "DHARA AI Environmental Simulation"

        # Attempt Live OpenWeatherMap API if API key is configured
        if settings.OPENWEATHERMAP_API_KEY and settings.OPENWEATHERMAP_API_KEY not in ["", "your-openweathermap-api-key-here"]:
            try:
                if lat is not None and lon is not None:
                    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={settings.OPENWEATHERMAP_API_KEY}&units=metric"
                else:
                    url = f"https://api.openweathermap.org/data/2.5/weather?q={location}&appid={settings.OPENWEATHERMAP_API_KEY}&units=metric"

                async with httpx.AsyncClient(timeout=6.0) as client:
                    resp = await client.get(url)
                    if resp.status_code == 200:
                        data = resp.json()
                        source_name = "OpenWeatherMap Live API"
                        main_data = data.get("main", {})
                        wind_data = data.get("wind", {})
                        weather_arr = data.get("weather", [{}])

                        # Rain & precipitation estimate
                        rain_obj = data.get("rain", {})
                        precip_1h = rain_obj.get("1h", 0.0) if isinstance(rain_obj, dict) else 0.0
                        clouds = data.get("clouds", {}).get("all", 10)
                        rain_prob = 85.0 if precip_1h > 0 else min(95.0, clouds * 0.8)

                        weather_raw = {
                            "temperature": float(main_data.get("temp", 28.0)),
                            "humidity": float(main_data.get("humidity", 65.0)),
                            "rain_probability": float(rain_prob),
                            "precipitation_mm": float(precip_1h),
                            "wind_speed": float(wind_data.get("speed", 3.2) * 3.6), # Convert m/s to km/h
                            "condition": str(weather_arr[0].get("main", "Clear")),
                            "forecast": generate_mock_weather()["forecast"]
                        }
            except Exception as e:
                logger.warning(f"Weather API request failed, falling back to simulation: {e}")

        # Fallback to realistic environmental simulation
        if not weather_raw:
            sim = generate_mock_weather()
            weather_raw = {
                "temperature": float(sim["temperature"]),
                "humidity": float(sim["humidity"]),
                "rain_probability": float(sim["rain_probability"]),
                "precipitation_mm": 2.5 if sim["rain_probability"] > 60 else 0.0,
                "wind_speed": float(sim["wind_speed"]),
                "condition": str(sim["description"]),
                "forecast": sim["forecast"]
            }

        # Generate Agronomic Advisories based on conditions
        temp = weather_raw["temperature"]
        rain_prob = weather_raw["rain_probability"]
        precip = weather_raw["precipitation_mm"]
        wind = weather_raw["wind_speed"]

        # 1. Irrigation Advisory
        if rain_prob >= 50.0 or precip >= 4.0:
            irrigation_adv = f"Rain likely ({rain_prob:.0f}% chance, {precip:.1f}mm expected). Postpone surface/drip irrigation to prevent waterlogging."
        elif temp >= 38.0:
            irrigation_adv = "Severe heatwave. Schedule irrigation during early morning (5:00-7:30 AM) or dusk to minimize evaporative loss."
        elif temp <= 4.0:
            irrigation_adv = "Near-freezing temperatures expected. Light evening irrigation recommended to protect root zone from frost damage."
        else:
            irrigation_adv = "Weather is clear and stable. Proceed with standard scheduled irrigation based on soil moisture."

        # 2. Fertilizer Spraying Advisory
        if wind >= 25.0:
            spray_adv = f"High wind speed ({wind:.1f} km/h). Suspend all foliar spraying and fertilizer dusting to avoid chemical drift."
        elif rain_prob >= 50.0:
            spray_adv = "Rain expected within 24h. Postpone foliar nutrient spraying to prevent chemical wash-off."
        else:
            spray_adv = "Wind and moisture conditions are optimal for foliar spray and fertilizer application."

        # 3. Thermal Stress Advisory
        if temp >= 40.0:
            heat_adv = "Extreme Heat Warning (> 40°C). High evapotranspiration rate. Ensure mulch coverage across beds."
        elif temp >= 35.0:
            heat_adv = "Moderate Heat Stress (35-40°C). Monitor crop canopy for midday wilting."
        elif temp <= 5.0:
            heat_adv = "Cold Stress / Frost Warning (< 5°C). Cover sensitive nursery saplings."
        else:
            heat_adv = "Temperature is in optimal vegetative range (20-32°C)."

        now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")

        result = schemas.WeatherDecisionResponse(
            location=location,
            timestamp=now_str,
            temperature_celsius=round(temp, 1),
            humidity_percent=round(weather_raw["humidity"], 1),
            rain_probability_percent=round(rain_prob, 1),
            precipitation_expected_mm=round(precip, 1),
            wind_speed_kmh=round(wind, 1),
            condition=weather_raw["condition"],
            forecast=weather_raw["forecast"],
            irrigation_advisory=irrigation_adv,
            fertilizer_spray_advisory=spray_adv,
            heat_stress_advisory=heat_adv,
            source=source_name
        )

        # Store in DB if db session provided
        if db:
            try:
                w_record = models.WeatherData(
                    field_id=field_id,
                    location=location,
                    timestamp=datetime.utcnow(),
                    temperature=result.temperature_celsius,
                    humidity=result.humidity_percent,
                    rain_probability=result.rain_probability_percent,
                    precipitation_mm=result.precipitation_expected_mm,
                    wind_speed=result.wind_speed_kmh,
                    condition=result.condition,
                    source=source_name,
                    raw_data=weather_raw
                )
                db.add(w_record)
                db.commit()
            except Exception as dberr:
                logger.warning(f"Could not persist WeatherData record: {dberr}")
                db.rollback()

        # Cache response
        weather_pipeline_cache[cache_key] = result
        return result
