# Dhara AI - System Development Roadmap (Phases 0 - 14)

This document presents the complete 15-phase engineering roadmap for **Dhara AI**, moving from initial architecture and monorepo foundation to full-scale commercial precision-agriculture deployment.

---

### Phase 0: Monorepo Foundation & Architecture Setup `[IMPLEMENTED]`

- Initialize npm workspaces monorepo (`apps/web`, `apps/api`, `packages/shared`, `packages/config`, `docs`, `docker`).
- Configure strict TypeScript, ESLint, Prettier, `.env.example`, `.gitignore`.
- Build Express REST API foundation with `GET /api/health`, centralized error handling, request logging, and env validation (`zod`).
- Enforce backend layered architecture: `Routes -> Controllers -> Services -> Repositories -> Database`.
- Establish React 18 frontend shell with Vite, Tailwind CSS, shadcn/ui base configuration, React Router, TanStack Query, Zustand, Recharts, Leaflet, Socket.IO client, Framer Motion.
- Establish shared TypeScript contracts (`@dhara/shared`) for telemetry, domain hierarchy, safety commands, and API responses.
- Setup local development Docker infrastructure for PostgreSQL and Mosquitto MQTT broker.

---

### Phase 1: Professional Public Website & Agricultural Design System `[IMPLEMENTED]`

- Commercial AgriTech public website with 11 responsive routes (`/`, `/technology`, `/how-it-works`, `/solutions`, `/features`, `/hardware`, `/ai`, `/sustainability`, `/about`, `/contact`, `/login`).
- Agricultural design system color tokens (deep natural green `#15803d`, soil brown `#78350f`, dark green-slate background `#060b08`) and typography (`Plus Jakarta Sans`, `JetBrains Mono`).
- Visualizations: `SystemArchitectureVisual` (`Soil → Field Pole → LoRaWAN → Gateway → Cloud → AI → Safety → Irrigation`), `InteractiveFarmStatus`, and `AIRecommendationDemoCard`.
- Mobile navigation menu drawer, form input primitives, accessibility `prefers-reduced-motion` support.

---

### Phase 2: Authentication, Multi-Tenant Organizations & Role-Based Access (RBAC) `[IMPLEMENTED]`

- Database-backed stateful session architecture storing SHA-256 token hashes in PostgreSQL (Prisma ORM) with raw tokens delivered via HttpOnly, SameSite cookies.
- 100% deterministic session revocation upon `POST /api/v1/auth/logout`.
- Multi-tenant organization model (`Organization`, `OrganizationMembership`) with server-side tenant isolation middleware (`requireOrganizationMembership`).
- Centralized RBAC permission engine with 7 roles (`SUPER_ADMIN`, `ORGANIZATION_ADMIN`, `FARM_OWNER`, `FARM_MANAGER`, `OPERATOR`, `TECHNICIAN`, `VIEWER`) and permission validation middleware (`requirePermission`, `requireRole`).
- Public registration (`POST /api/v1/auth/register`), authentication (`POST /api/v1/auth/login`), profile (`GET /api/v1/auth/me`), and organization onboarding (`POST /api/v1/orgs`).
- Controlled onboarding rules: Public registration cannot self-assign `SUPER_ADMIN`; Organization creators automatically receive `ORGANIZATION_ADMIN`.
- Frontend `AuthProvider` & `AuthContext`, `/register`, `/login`, `/onboarding`, and protected `/app` portal dashboard.
- Automated security unit tests verifying password hashing (bcrypt), duplicate email rejection, invalid password rejection, session revocation, and multi-tenant isolation.

---

### Phase 3: Physical Hierarchy, Agricultural Crop Management & Private Application Shell `[IMPLEMENTED]`

- Complete domain hierarchy models: `Organization -> Farm -> Field -> Zone -> CropCycle` and `Crop` catalog in PostgreSQL via Prisma ORM.
- Non-destructive soft-delete / archive strategy (`status = ARCHIVED`) preserving historical audit trails.
- Server-side multi-tenant isolation and hierarchy validation enforcing that Farms, Fields, Zones, and CropCycles verify organization membership.
- Server-side validation enforcing that Zone area cannot exceed total Field area (`zone.area <= field.area`).
- Read-only Crop catalog for standard organization users (`Wheat`, `Rice`, `Maize`, `Potato`, `Tomato`, `Cotton`, `Sugarcane`, `Mustard`, `Vegetables`, `Other`).
- Layered REST APIs (`/api/v1/farms`, `/api/v1/fields`, `/api/v1/zones`, `/api/v1/crops`, `/api/v1/dashboard/metrics`) with strict RBAC permission guards.
- Authenticated private application shell (`AppShellLayout`) featuring persistent responsive sidebar navigation, top bar, organization switcher, and mobile drawer.
- Private application pages (`/app/dashboard`, `/app/farms`, `/app/farms/:farmId`, `/app/fields`, `/app/fields/:fieldId`, `/app/zones`).
- Real database metric calculations (`totalFarms`, `totalFields`, `totalZones`, `activeCropCycles`) aggregated directly from PostgreSQL with zero simulated/hardcoded telemetry.
- Leaflet farm map displaying real farm and field location markers using stored latitude/longitude coordinates (zero fake field polygons).
- Future modules (`Devices`, `Soil Intelligence`, `Irrigation`, `Fertigation`, `AI Assistant`, `Analytics`, `Alerts`, `Reports`, `Settings`) clearly tagged as **[COMING SOON]**.
- Automated test suite verifying Farm/Field/Zone CRUD, zone area validation, multi-tenant isolation, and RBAC permission enforcement.

---

### Phase 4: Device Registry & Telemetry Schema Specification `[PLANNED]`

- Device provisioning, serial registration, and hardware pairing for ESP32-C3 Field Poles and ESP32-S3 Substations.
- Strict schema validation for soil N, P, K, pH, EC, Moisture, Temp, solar voltage, battery level, RSSI.

---

### Phase 5: Time-Series Telemetry Pipeline & TimescaleDB Integration `[PLANNED]`

- Enable TimescaleDB hyper-tables for high-frequency telemetry ingestion.
- Continuous aggregates for hourly, daily, and monthly soil moisture & nutrient averages.
- Telemetry ingestion HTTP/MQTT endpoints.

---

### Phase 6: MQTT Broker, ChirpStack & LoRaWAN Boundary Integration `[FUTURE HARDWARE]`

- Connect backend MQTT client service to Mosquitto / ChirpStack Network Server.
- Decode raw LoRaWAN binary payloads from ESP32-C3 field nodes.
- Downlink command dispatch to ESP32-S3 central substation gateways.

---

### Phase 7: Deterministic Safety Engine & Command Authorization Pipeline `[PLANNED]`

- Implement the mandatory physical control safety pipeline:
  `Frontend -> Backend API -> Auth & Authz -> Safety Validation -> Command Service -> MQTT -> Substation`
- Deterministic rules engine enforcing maximum run durations, mutual exclusion (prevent pump dry-run), flow rate limits, and pressure limits.
- Immutable audit logging for all actuator state changes.

---

### Phase 8: Real-Time Communication & WebSockets Layer `[PLANNED]`

- Integrate Socket.IO server on backend API.
- Live streaming of telemetry updates, actuator status changes, and safety alerts to frontend dashboard clients.

---

### Phase 9: Telemetry Data Simulator & Virtual Testing Harness `[PLANNED]`

- Build an isolated physical environment simulator to emulate field poles, weather patterns, and soil drying curves.
- All simulated data packets explicitly tagged with `isSimulated: true`. Zero fake telemetry mixed into production streams.

---

### Phase 10: AI Advisory & Precision Irrigation Engine `[PLANNED]`

- Clean AI service boundary for evapotranspiration ($ET_c$) calculation and crop water stress index (CWSI).
- Generates actionable irrigation & fertigation recommendations.
- **Safety Interlock**: AI recommendations MUST pass through the deterministic safety engine before execution. AI never bypasses safety.

---

### Phase 11: Real-Time Monitoring Dashboard & Geospatial Mapping `[PLANNED]`

- Interactive Leaflet GIS mapping displaying field poles, substations, and active irrigation zones with color-coded status.
- Real-time Recharts soil moisture and NPK trend analytics charts.

---

### Phase 12: Alerting, Notification & Audit Logging System `[PLANNED]`

- Threshold alert engine (e.g., low soil moisture, abnormal pH, low battery, device offline).
- Multi-channel notification delivery (In-app, SMS, Email, Push).
- Security and operational audit log viewer.

---

### Phase 13: Substation Offline-First / Local Gateway Firmware Architecture `[FUTURE HARDWARE]`

- Firmware specifications for ESP32-S3 substation gateway to store local safety interlocks and schedule queues.
- Enables local autonomous operation during cloud network connectivity loss.

---

### Phase 14: Commercial Deployment, Hardening & Multi-Organization Analytics `[PLANNED]`

- Multi-region deployment scripts, load testing, security penetration testing, and rate limiting.
- Cross-farm analytics, water consumption metrics, yield optimization reports, and government agricultural compliance reports.
