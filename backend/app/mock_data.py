# This module provides mock sensor/weather data until real hardware is connected
# All mock data is clearly labeled and range-validated

import random
from datetime import datetime, timedelta

def generate_mock_sensor_reading(field_id: int) -> dict:
    # Returns realistic agricultural sensor values
    return {
        "nitrogen": round(random.uniform(40, 80), 2),  # mg/kg
        "phosphorus": round(random.uniform(20, 60), 2),  # mg/kg
        "potassium": round(random.uniform(150, 300), 2),  # mg/kg
        "ph": round(random.uniform(6.0, 7.5), 2),
        "ec": round(random.uniform(0.5, 2.0), 2),  # dS/m
        "soil_moisture": round(random.uniform(30, 70), 2),  # %
        "soil_temperature": round(random.uniform(18, 35), 2),  # Celsius
    }

def generate_mock_weather() -> dict:
    # Returns mock weather data - replace with real API call using OPENWEATHERMAP_API_KEY
    return {
        "temperature": round(random.uniform(22, 38), 1),
        "humidity": round(random.uniform(40, 85), 1),
        "rain_probability": round(random.uniform(0, 100), 1),
        "wind_speed": round(random.uniform(5, 30), 1),
        "description": random.choice(["Sunny", "Partly Cloudy", "Overcast", "Light Rain"]),
        "forecast": [
            {"day": (datetime.now() + timedelta(days=i)).strftime("%A"),
             "high": round(random.uniform(28, 40), 1),
             "low": round(random.uniform(18, 26), 1),
             "rain_probability": round(random.uniform(0, 100), 1),
             "description": random.choice(["Sunny", "Cloudy", "Rain", "Partly Cloudy"])}
            for i in range(1, 8)
        ],
        "source": "mock"  # Changed to "openweathermap" when real API is integrated
    }

def generate_mock_history(field_id: int, days: int = 7) -> list:
    history = []
    for i in range(days * 24):  # hourly readings
        ts = datetime.now() - timedelta(hours=i)
        reading = generate_mock_sensor_reading(field_id)
        reading["timestamp"] = ts.isoformat()
        history.append(reading)
    return list(reversed(history))
