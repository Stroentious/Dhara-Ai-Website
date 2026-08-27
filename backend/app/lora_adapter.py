"""
LoRa/Modbus Hardware Adapter
============================
This module provides a clean interface between DHARA AI and real LoRa hardware.
Currently runs in MOCK mode. To integrate real hardware:
1. Set LORA_MODE=real in .env
2. Implement parse_real_lora_payload() with actual Modbus register definitions
3. Validate device identity against database

NOTE: Do NOT hardcode Modbus register addresses here - they vary by sensor model.
Obtain register map from your 7-in-1 sensor manufacturer's datasheet.
"""

from typing import Optional, Dict, Any
import hmac
import hashlib
import time
from app.config import settings

class LoRaPacketError(Exception):
    pass

class LoRaAdapter:
    """
    Configurable adapter for LoRa uplink packets.
    Supports mock mode for testing without hardware.
    """
    
    def validate_device_signature(self, device_id: str, payload: dict, signature: Optional[str]) -> bool:
        """Validate HMAC signature on incoming LoRa packets to prevent spoofing."""
        if settings.ENVIRONMENT == "development":
            return True  # Skip in dev mode
        if not signature:
            raise LoRaPacketError("Missing device signature")
        
        # Use str representation of timestamp if provided
        timestamp = payload.get('timestamp', '')
        message = f"{device_id}:{timestamp}".encode()
        
        expected = hmac.new(
            settings.LORA_DEVICE_SECRET.encode(),
            message,
            hashlib.sha256
        ).hexdigest()
        
        if not hmac.compare_digest(expected, signature):
            raise LoRaPacketError("Invalid device signature")
        return True
    
    def validate_payload_ranges(self, parsed: dict) -> dict:
        """Validate sensor readings are within physically possible ranges."""
        ranges = {
            "nitrogen": (0, 9999),
            "phosphorus": (0, 9999),
            "potassium": (0, 9999),
            "ph": (0, 14),
            "ec": (0, 100),
            "soil_moisture": (0, 100),
            "soil_temperature": (-50, 100),
        }
        for field, (min_val, max_val) in ranges.items():
            if field in parsed and parsed[field] is not None:
                if not (min_val <= parsed[field] <= max_val):
                    raise LoRaPacketError(f"Sensor value out of range: {field}={parsed[field]}")
        return parsed
    
    def parse_mock_payload(self, raw_payload: dict) -> dict:
        """Parse mock LoRa payload - used for testing without hardware."""
        from app.mock_data import generate_mock_sensor_reading
        return generate_mock_sensor_reading(0)
    
    def parse_real_lora_payload(self, raw_bytes: bytes, device_model: str) -> dict:
        """
        TODO: Implement real LoRa/Modbus packet parsing here.
        
        Required information from hardware vendor:
        - Modbus register addresses for each sensor parameter
        - Data types (int16, uint16, float32, etc.)
        - Scaling factors/offsets
        - LoRa packet framing format
        - CRC validation scheme
        
        Do NOT hardcode register maps - load from config file or database.
        """
        raise NotImplementedError(
            "Real LoRa parsing not implemented. "
            "Provide hardware register map and packet format to implement."
        )
    
    def process_uplink(self, device_id: str, payload: dict, signature: Optional[str] = None) -> dict:
        """Main entry point for processing LoRa uplink packets."""
        self.validate_device_signature(device_id, payload, signature)
        # In mock mode, generate mock data; real mode would parse actual bytes
        parsed = self.parse_mock_payload(payload)
        return self.validate_payload_ranges(parsed)

lora_adapter = LoRaAdapter()
