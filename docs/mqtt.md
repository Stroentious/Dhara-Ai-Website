# Dhara AI - MQTT & LoRaWAN Boundary Specification

## MQTT Topic Hierarchy Taxonomy `[PLANNED]`

Dhara AI uses a structured topic hierarchy for field pole telemetry and substation commands.

### 1. Telemetry Ingestion (Uplink)

`dhara/v1/{orgId}/{farmId}/telemetry/{fieldPoleId}`

**Sample Uplink Payload:**

```json
{
  "packetId": "pkt_9f81a2b",
  "fieldPoleId": "pole_zone1_01",
  "substationId": "sub_farm_alpha",
  "timestamp": "2026-08-12T17:20:00Z",
  "readings": {
    "nitrogen": 45.2,
    "phosphorus": 18.7,
    "potassium": 142.0,
    "ph": 6.8,
    "ec": 1.45,
    "soilMoisture": 28.5,
    "soilTemperature": 24.1
  },
  "health": {
    "solarVoltage": 4120,
    "batteryLevel": 94,
    "rssi": -85,
    "snr": 9.5,
    "uptimeSeconds": 86400
  }
}
```

---

### 2. Substation Control Commands (Downlink)

`dhara/v1/{orgId}/{farmId}/substation/{substationId}/command`

**Sample Downlink Command:**

```json
{
  "commandId": "cmd_8192a3",
  "commandType": "START_PUMP",
  "target": {
    "substationId": "sub_farm_alpha",
    "actuatorType": "PUMP",
    "actuatorId": "pump_main_01"
  },
  "durationSeconds": 1800,
  "requestedAt": "2026-08-12T17:22:00Z"
}
```

---

## Infrastructure Boundaries

- **Mosquitto MQTT Broker `[IMPLEMENTED]`**: Local Docker container for message broker development.
- **ChirpStack Integration Boundary `[FUTURE HARDWARE]`**: Network Server connecting SX1262 LoRa physical layer to MQTT topics.
