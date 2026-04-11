# Tenant Registration - Phase 8 Walkthrough (DB-Backed Core Identity Projection)

## Scope
- Implemented DB-backed core identity projection creation and activation in the tenant registration flow.
- The SQL-backed tenant store now creates and manages:
  - `core.tenants`
  - `core.organizations`
  - `core.users`
  - `private.user_pii`
- Activation via verified webhook updates tenant/user projection status and sets Keycloak external user id.

## Files Modified

### Core Projection Repository
- `capabilities/tenant/adapters/db/repositories/core_identity_projection_repository.py`
  - implemented:
    - `create_registration_projection(...)`
    - `mark_registration_projection_activated(...)`
    - `delete_registration_projection(...)`
  - includes slug generation and duplicate-slug fallback suffixing

### SQL Registration Store
- `capabilities/tenant/adapters/db/sql_store.py`
  - registration create now creates tenant/org/user/user_pii projections via repository
  - activation path marks tenant/user active and updates `external_id`
  - rollback path deletes projections
  - runtime bootstrap now ensures `core` and `private` schemas and creates projection tables if needed

## Validation - Unit Tests (API container)
Tenant unit suite still passes after projection wiring (pytest remains memory-backed):

```bash
docker exec service-gen-api sh -lc 'cd /app && PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 /app/.venv/bin/python -m pytest capabilities/tenant/tests/unit -q'
```

Observed:
- `12 passed`

## Validation - Live API Flow (Real Runtime)
### Steps
1. Restarted `service-gen-api`
2. Executed live tenant registration + signed webhook verification flow via HTTP to `127.0.0.1:8000` in-container
3. Queried DB directly using `SessionLocal` and tenant domain ORM models

### Observed Route Results
- registration status progressed:
  - `pending / EmailVerificationPending` -> `active / TenantActivated`
- webhook verification returned `200`
- `tenant_id` returned in API response

### Observed DB Projection Results
From DB query after live flow:
- `tenant_reg.registration_requests` row exists and is `active / TenantActivated`
- `core.tenants` row exists and is `active`
- `core.organizations` row exists and is linked to tenant
- `core.users` row exists and is `active`, role=`owner`
- `core.users.external_id` updated to Keycloak skeleton id (e.g. `kc-<registration-prefix>`)
- `private.user_pii` row exists (`email_enc` persisted)

## Example Verified Output (abbreviated)
- `tenant True active projection-tenant`
- `org True Projection Tenant <tenant_id>`
- `user True active owner kc-47848d51`
- `pii True <bytes_len>`

## Notes
- `UserPII.email_enc` is currently placeholder bytes (plaintext bytes persisted as encrypted-field placeholder) and must be replaced with real encryption/KMS integration in a later hardening phase.
- Core projection creation is now DB-backed and integrated into live tenant registration runtime path.
- This phase materially advances the skeleton toward real tenant provisioning behavior.

## Next Phase (Recommended)
- Harden real Keycloak integration (Admin API + webhook validation beyond skeleton)
- Harden OPA decisions (real policy allow/deny impacts in flow)
- Add integration tests for DB-backed projection repository behavior
- Begin e2e onboarding tests (SaaS -> API -> webhook simulation) once Keycloak path is sufficiently real
