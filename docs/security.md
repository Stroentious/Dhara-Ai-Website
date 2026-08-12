# Dhara AI - Security & Multi-Tenant Authorization Architecture

This document details the security model, database-backed session architecture, password hashing standards, role-based access control (RBAC), and multi-tenant organization isolation boundaries for **Dhara AI**.

---

## 1. Authentication & Session Strategy `[IMPLEMENTED]`

Dhara AI uses a **Database-Backed Stateful Session Architecture** with HttpOnly, SameSite cookies.

```
Browser Client
   │ (HttpOnly Cookie: dhara_session=<raw_session_token>)
   ▼
Backend Middleware (authenticate)
   │ 1. Extract raw_session_token from HttpOnly cookie
   │ 2. Hash raw token using SHA-256 (sessionTokenHash)
   │ 3. Query Session model in Database where sessionTokenHash = hash
   │ 4. Verify expiresAt > NOW() AND revokedAt IS NULL
   │ 5. Asynchronously touch lastUsedAt timestamp
   ▼
User Context Attached to req.user (Excludes passwordHash & secrets)
   │
   ▼
Tenant Authorization Middleware (requireOrganizationMembership)
   │ Verify userId has active membership in target organizationId
   ▼
RBAC Permission Middleware (requirePermission)
   │ Verify user's role grants required permission
   ▼
Controller Action Execution
```

### Key Security Properties:

- **Zero Raw Tokens in DB**: Only the SHA-256 hash of the session token is saved in the `Session` model.
- **XSS Protection**: Raw session tokens reside exclusively inside HttpOnly, SameSite cookies (or Bearer headers for API clients). LocalStorage is NEVER used for session tokens.
- **100% Deterministic Logout**: `POST /api/v1/auth/logout` sets `revokedAt = NOW()` on the DB session record and clears the cookie. Subsequent requests with revoked tokens are immediately rejected with `401 UNAUTHORIZED`.

---

## 2. Password Hashing & Account Security `[IMPLEMENTED]`

- **Salting & Hashing**: Passwords hashed using `bcryptjs` with 12 salt rounds.
- **Secret Filtering**: `passwordHash` is excluded from all `UserDTO` responses and never logged.
- **Rate Limiting**: `POST /api/v1/auth/login` and `/register` endpoints are protected by `authRateLimiter` (max 30 requests per 15 minutes per IP).
- **Controlled Privilege Escalation Rules**:
  - Public registration (`POST /api/v1/auth/register`) CANNOT self-assign `SUPER_ADMIN` or `ORGANIZATION_ADMIN`.
  - Organization creator automatically receives `ORGANIZATION_ADMIN` membership for that organization via controlled server-side logic.

---

## 3. Roles & Permission Matrix `[IMPLEMENTED]`

| Role                 | Scope                       | Key Permissions                                                                                                  |
| :------------------- | :-------------------------- | :--------------------------------------------------------------------------------------------------------------- |
| `SUPER_ADMIN`        | Platform Administration     | All permissions (`USER_MANAGE`, `ORGANIZATION_MEMBERS_MANAGE`, `IRRIGATION_CONTROL`, `AI_APPROVE`, `AUDIT_READ`) |
| `ORGANIZATION_ADMIN` | Organization Administration | Organization management, member administration, farm creation, full control                                      |
| `FARM_OWNER`         | Farm Ownership              | Farm creation/updates, device management, control operations, report generation                                  |
| `FARM_MANAGER`       | Operational Management      | Farm updates, device management, telemetry read, control operations, AI approval                                 |
| `OPERATOR`           | Field Operations            | Telemetry read, irrigation/fertigation control operations, report read                                           |
| `TECHNICIAN`         | Device Maintenance          | Device read/manage, telemetry read, irrigation read, diagnostics                                                 |
| `VIEWER`             | Read-Only                   | Read-only access to telemetry, reports, and system status (NO control operations)                                |

---

## 4. Multi-Tenant Server-Side Isolation `[IMPLEMENTED]`

- All organization-scoped requests pass through `requireOrganizationMembership('organizationId')`.
- The database queries the user's `OrganizationMembership` record server-side.
- Frontend organization IDs provided in URLs or request bodies are NEVER trusted without server-side verification.

---

## 5. Security Audit Logging `[IMPLEMENTED]`

Authentication and security events are recorded in the `AuditLog` table:

- `USER_REGISTERED`
- `LOGIN`
- `LOGIN_FAILED`
- `LOGOUT`
- `ORGANIZATION_CREATED`
- `MEMBERSHIP_CREATED`
- `ROLE_CHANGED`

Passphrases, session tokens, and raw credentials are NEVER recorded in audit log records.
