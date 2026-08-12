# Dhara AI - Precision Agriculture & Smart Fertigation Platform

Dhara AI is an enterprise-grade precision-agriculture IoT platform engineered for real-time soil telemetry monitoring, intelligent irrigation scheduling, and automated fertigation.

## Architectural Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Router, TanStack Query, Zustand, Recharts, Leaflet, Socket.IO client, Framer Motion.
- **Backend API**: Node.js, Express, TypeScript, REST API (`/api/v1/`), Socket.IO, Zod validation, Winston structured logging. (Strict Layering: `Routes -> Controllers -> Services -> Repositories -> Database`).
- **Shared Package**: `@dhara/shared` (TypeScript types, domain entities, safety pipeline contracts, API interfaces).
- **Database**: PostgreSQL primary relational database (TimescaleDB time-series compatible).
- **IoT & Control Boundaries**: MQTT integration boundary, ChirpStack LoRaWAN boundary, and deterministic safety command validation engine.

## Monorepo Layout

```
dhara-ai/
├── apps/
│   ├── web/                  # React 18 Frontend Application Shell
│   └── api/                  # Express REST API Service
├── packages/
│   ├── shared/               # Shared Domain & API TypeScript Contracts
│   └── config/               # Shared TSConfig & Linter Configurations
├── docs/                     # Architectural Documents & 15-Phase Roadmap
│   ├── architecture.md
│   ├── database.md
│   ├── api.md
│   ├── mqtt.md
│   ├── security.md
│   └── roadmap.md            # Complete 15-Phase Implementation Roadmap
├── docker/                   # Local Infrastructure (PostgreSQL, Mosquitto MQTT)
│   └── docker-compose.yml
├── .env.example
├── README.md
└── package.json
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker & Docker Compose (optional for local DB/MQTT)

### Installation

```bash
# Install all monorepo dependencies
npm install
```

### Running Development Servers

```bash
# Start Backend API (runs on port 5000)
npm run dev:api

# Start Frontend Web Shell (runs on port 5173)
npm run dev:web
```

### Verification Commands

```bash
# Run TypeScript compilation check across all workspace packages
npm run typecheck

# Run ESLint across all packages
npm run lint

# Build all production bundles
npm run build
```

## Operational Safety Pipeline

All physical actuator commands (pumps, valves, fertigation) flow strictly through the deterministic safety pipeline:

$$\text{Frontend UI} \xrightarrow{\text{REST/WSS}} \text{Backend API} \xrightarrow{\text{Auth Check}} \text{Safety Validation Engine} \xrightarrow{\text{Audit Log}} \text{MQTT Broker} \xrightarrow{\text{LoRaWAN}} \text{Substation}$$

High-voltage hardware is never directly operated by browser applications.

## License

Proprietary & Confidential - Dhara AI Project.
