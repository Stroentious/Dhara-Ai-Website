# Dhara AI - REST API & Realtime Specification

## Base URL & Versioning

All API requests are versioned under `/api/v1/` `[IMPLEMENTED]`.
Root health check endpoint is available at `/api/health` `[IMPLEMENTED]`.

## Implemented Endpoints (Phase 0)

### `GET /api/health`

- **Description**: Public health check endpoint for monitoring service availability.
- **Auth Required**: No
- **Response**:

```json
{
  "success": true,
  "service": "dhara-api",
  "status": "healthy"
}
```

---

## Planned API Endpoints (Phase 1+)

### Authentication (`/api/v1/auth`) `[PLANNED]`

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`

### Farms & Fields (`/api/v1/farms`) `[PLANNED]`

- `GET /api/v1/farms`
- `POST /api/v1/farms`
- `GET /api/v1/farms/:id/fields`

### Actuator Control Pipeline (`/api/v1/commands`) `[PLANNED]`

- `POST /api/v1/commands/pump`
- `POST /api/v1/commands/valve`
- `POST /api/v1/commands/fertigation`

All command requests pass through authentication, authorization, safety validation, command logging, and MQTT dispatch.
