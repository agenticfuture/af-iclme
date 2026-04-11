# Tenant Registration - Phase 7 Walkthrough (DB-Backed Registration Store in Real API Runtime)

## Scope
- Replaced the runtime tenant registration persistence backend (real API runtime) from in-memory to SQLAlchemy/Postgres-backed store.
- Preserved the existing store interface so caps/workflows did not need rewrites.
- Kept pytest/unit runs on the in-memory backend for deterministic test isolation.
- Added runtime bootstrap for tenant registration/evidence schemas/tables (temporary bridge until domain Alembic wiring is fully executable).

## Files Added / Modified

### New
- `capabilities/tenant/adapters/db/sql_store.py`
  - `TenantRegistrationSqlStore`
  - `ensure_tenant_registration_tables()`

### Modified
- `capabilities/tenant/factory.py`
  - auto-selects backend:
    - memory store during pytest
    - SQLAlchemy store in real runtime when Postgres `DATABASE_URL`/`TENANT_DB_URL` is detected
    - memory fallback on DB init failure
- `capabilities/tenant/adapters/db/models/registration.py`
  - fixed SQLAlchemy declarative reserved-name issue:
    - ORM attribute renamed to `transition_metadata` mapped to DB column `"metadata"`
- `capabilities/tenant/adapters/db/sql_store.py`
  - adjusted transition reads/writes to use `transition_metadata`

## Important Issue Found and Fixed
### SQLAlchemy Declarative Reserved Attribute Name
`RegistrationStateTransition` originally used:
- `metadata = Column(JSONB, ...)`

This is invalid in Declarative models because `.metadata` is reserved by SQLAlchemy, causing:
- `sqlalchemy.exc.InvalidRequestError: Attribute name 'metadata' is reserved`

Fix:
- renamed ORM attribute to `transition_metadata`
- preserved DB column name as `"metadata"`

## Backend Selection Behavior (Current)
- **pytest/unit tests**: force memory backend (by checking pytest env vars)
- **real API runtime**: detect Postgres URL and initialize/use `TenantRegistrationSqlStore`
- fallback to memory if DB bootstrap fails

This keeps tests stable while enabling DB persistence in the API container.

## Runtime Validation - Unit Tests (API container)
After DB-backed changes and SQLAlchemy fix:

```bash
docker exec service-gen-api sh -lc 'cd /app && PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 /app/.venv/bin/python -m pytest capabilities/tenant/tests/unit -q'
```

Observed:
- `12 passed`

## Runtime Validation - Real API Uses SQL Store
### Confirmed via logs
`service-gen-api` logs after restart show:
- `tenant.registration_store.init | {'backend': 'sqlalchemy', 'reason': 'postgresql_detected'}`

### Confirmed via in-container introspection
```bash
docker exec service-gen-api sh -lc 'cd /app && /app/.venv/bin/python - <<\"PY\"\nfrom capabilities.tenant.factory import tenant_domain\nprint(type(tenant_domain._deps.registration_store).__name__)\nPY'
```

Observed:
- `TenantRegistrationSqlStore`

## Live API Validation (Real Runtime + DB Persistence)
Executed live tenant flow against `service-gen-api`:
- `POST /api/tenant/v1/register`
- `POST /api/tenant/v1/verify-email-webhook` (correctly signed payload)
- `GET /api/tenant/v1/registrations/{id}`

Then queried tenant DB-backed tables in-process (`SessionLocal`) to confirm persistence.

Observed:
- route flow: `pending / EmailVerificationPending -> active / TenantActivated`
- DB row exists in `tenant_reg.registration_requests`
- policy decision rows persisted (`3`)
- transition rows persisted (`10`)

## Notes
- The runtime bootstrap currently uses SQLAlchemy `create_all` + `CREATE SCHEMA IF NOT EXISTS` for tenant registration/evidence tables as a bridge.
- Domain Alembic migration file (`0001_create_tenant_domain_tables.py`) remains the authoritative migration artifact, but the domain Alembic runtime wiring is not yet fully integrated/executed in this phase.
- Core tenant/org/user projection is still skeleton-level and not yet persisted through dedicated repositories in the live runtime path.

## Next Phase (Recommended)
- Replace skeleton tenant/user projection with DB-backed `CoreIdentityProjectionRepository`
- Wire actual tenant/org/user/user_pii creation in registration flow
- Add DB-backed tests for repository behavior
- Then move to real Keycloak + OPA integration hardening and e2e browser flow
