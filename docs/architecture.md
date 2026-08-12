# Dhara AI - System Architecture Specification

## Overview

**Dhara AI** is a multi-tenant precision agriculture platform designed to monitor soil parameters (Nitrogen, Phosphorus, Potassium, pH, EC, Moisture, Temperature) and safely automate field irrigation and fertigation.

## System Topology & Layers

```
+-----------------------------------------------------------------------------------+
| FRONTEND LAYER (React 18 + Vite + Tailwind CSS + shadcn/ui)         [IMPLEMENTED] |
| - User Interface, Dashboard Shell, Leaflet GIS, Recharts Data Viz                 |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼ REST API / WebSockets
+-----------------------------------------------------------------------------------+
| BACKEND API LAYER (Express + TypeScript + Layered Architecture)     [IMPLEMENTED] |
| - Routes -> Controllers -> Services -> Repositories -> Database                   |
| - Authentication, Tenant Isolation & RBAC Enforcement               [PLANNED]     |
| - Deterministic Safety Engine & Command Pipeline                    [PLANNED]     |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼ Internal Service Boundary
+-----------------------------------------------------------------------------------+
| MQTT & LORAWAN INTEGRATION BOUNDARY                                 [PLANNED]     |
| - Mosquitto MQTT Broker (Local Dev Container)                       [IMPLEMENTED] |
| - ChirpStack LoRaWAN Network Server Integration                     [FUTURE HW]   |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼ LoRaWAN Wireless Link (SX1262)
+-----------------------------------------------------------------------------------+
| PHYSICAL HARDWARE LAYER                                             [FUTURE HW]   |
| - Central Substation (ESP32-S3): Pump, Valve, Fertigation Relays                  |
| - Field Poles (ESP32-C3): RS485 Modbus Soil NPK/pH/EC/Temp/Moisture Sensors      |
+-----------------------------------------------------------------------------------+
```

## Core Architectural Principles Enforced

1. **Frontend Isolation `[IMPLEMENTED]`**: The browser client NEVER accesses the database directly, NEVER holds MQTT broker credentials, and NEVER holds secret keys.
2. **Deterministic Control Pipeline `[PLANNED]`**: Physical actuator control commands (pumps, valves, fertigation) flow strictly through:
   $$\text{Frontend UI} \rightarrow \text{Backend API} \rightarrow \text{Auth Check} \rightarrow \text{Safety Validation} \rightarrow \text{Command Service} \rightarrow \text{MQTT} \rightarrow \text{Substation}$$
3. **AI Guardrails `[PLANNED]`**: The AI decision engine generates recommendations only. Recommendations MUST pass through deterministic safety rules before execution.
4. **Time-Series Ingestion `[PLANNED]`**: High-frequency telemetry packets are ingested into TimescaleDB hyper-tables with automated compression policies.

## Subsystem Implementation Status

- **Monorepo & Package Boundaries**: `[IMPLEMENTED]`
- **REST API Base (`/api/health`, `/api/v1`)**: `[IMPLEMENTED]`
- **Backend Architecture Layering**: `[IMPLEMENTED]`
- **Frontend App Shell & Routing**: `[IMPLEMENTED]`
- **PostgreSQL / TimescaleDB Schema**: `[PLANNED]`
- **MQTT / LoRaWAN Ingestion Boundary**: `[FUTURE HARDWARE]`
- **ESP32 Microcontroller Firmware**: `[FUTURE HARDWARE]`
