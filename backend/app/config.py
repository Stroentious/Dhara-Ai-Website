from pydantic_settings import BaseSettings
from typing import List
from dotenv import load_dotenv
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV_PATH = os.path.join(BASE_DIR, ".env")
load_dotenv(dotenv_path=ENV_PATH)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
OPENWEATHERMAP_API_KEY = os.getenv("OPENWEATHERMAP_API_KEY")
LORA_DEVICE_SECRET = os.getenv("LORA_DEVICE_SECRET")
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./dharaai_local.db"
    SECRET_KEY: str = "change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    GROQ_API_KEY: str = ""
    OPENWEATHERMAP_API_KEY: str = ""
    LORA_DEVICE_SECRET: str = ""
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ]
    ENVIRONMENT: str = "development"
    HARDWARE_MODE: str = "SIMULATION"

    class Config:
        env_file = ENV_PATH
        extra = "ignore"

settings = Settings()

