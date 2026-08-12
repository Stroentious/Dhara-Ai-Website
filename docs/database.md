# Dhara AI - Database Architecture Specification

## Overview

Dhara AI uses **PostgreSQL** as its primary relational data store `[IMPLEMENTED]`, architected to seamlessly integrate **TimescaleDB** extensions `[PLANNED]` for time-series telemetry.

## Multi-Tenant Data Hierarchy

```
Organization (1)
   └── Farm (N)
        └── Field (N)
             ├── IrrigationZone (N)
             │    └── FieldPole Sensor Nodes (N) -> Telemetry Time-Series
             └── Substation Gateways (1..N)
                  ├── Pumps (N)
                  ├── Valves (N)
                  └── Fertigation Units (N)
```

## Database Engine Strategy

1. **Relational Data (PostgreSQL 16+) `[IMPLEMENTED]`**:
   - Stores tenant accounts, farms, field spatial boundaries, device registries, safety rules, user credentials, and audit logs.
2. **Time-Series Telemetry Data (TimescaleDB) `[PLANNED]`**:
   - Soil telemetry readings (`soil_telemetry` hyper-table partitioned by `time` and `field_pole_id`).
   - Device battery, solar voltage, and signal RSSI diagnostics.

## Key Relational Schemas (Planned for Phase 1)

### `organizations`

- `id`: UUID (PK)
- `name`: VARCHAR(255)
- `slug`: VARCHAR(255) UNIQUE

### `farms`

- `id`: UUID (PK)
- `organization_id`: UUID (FK -> organizations.id)
- `name`: VARCHAR(255)
- `latitude`: NUMERIC(10, 8)
- `longitude`: NUMERIC(11, 8)

### `soil_telemetry` (Hyper-table `[PLANNED]`)

- `time`: TIMESTAMPTZ NOT NULL
- `field_pole_id`: UUID NOT NULL
- `nitrogen`: NUMERIC(6, 2)
- `phosphorus`: NUMERIC(6, 2)
- `potassium`: NUMERIC(6, 2)
- `ph`: NUMERIC(4, 2)
- `ec`: NUMERIC(8, 2)
- `soil_moisture`: NUMERIC(5, 2)
- `soil_temperature`: NUMERIC(5, 2)
- `is_simulated`: BOOLEAN DEFAULT FALSE
