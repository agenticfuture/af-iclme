# Tenant Registration - Phase 2 Walkthrough

Timestamp: 2026-02-24 AST
Scope: Phase 2 (core registration persistence skeleton + APIs + tests)
Status: Completed and validated in `service-gen-api` Docker container

## 1. Goal
Implement an executable Phase 2 tenant registration skeleton on top of the Phase 1 domain scaffold:
- real cap modules for `register/status/resend/purge`
- domain API wired to cap handlers
- runnable persistence behavior (in-memory store for skeleton execution)
- first real tenant-domain migration draft (`0001`)
- unit tests and route smoke checks validated in Docker API container

## 2. Files Added / Updated
### New shared executable store (Phase 2 runtime skeleton)
- `capabilities/tenant/shared/memory_store.py`

### New cap modules
- `capabilities/tenant/caps/register_tenant/__init__.py`
- `capabilities/tenant/caps/register_tenant/entities.py`
- `capabilities/tenant/caps/register_tenant/tasks.py`
- `capabilities/tenant/caps/register_tenant/workflow.py`
- `capabilities/tenant/caps/register_tenant/handler.py`

- `capabilities/tenant/caps/get_registration_status/__init__.py`
- `capabilities/tenant/caps/get_registration_status/handler.py`

- `capabilities/tenant/caps/resend_verification/__init__.py`
- `capabilities/tenant/caps/resend_verification/handler.py`

- `capabilities/tenant/caps/purge_unverified/__init__.py`
- `capabilities/tenant/caps/purge_unverified/handler.py`

### Migration draft
- `capabilities/tenant/adapters/db/migrations/versions/0001_create_tenant_domain_tables.py`

### Tests
- `capabilities/tenant/tests/unit/test_phase2_registration_flow.py`

### Factory wiring updated
- `capabilities/tenant/factory.py`
  - domain now owns `registration_store`
  - `TenantDomainAPI` methods route to handlers
  - routes added for status/resend/purge

## 3. What Was Implemented (Behavior)
### 3.1 Register Tenant (Phase 2 skeleton)
- validates consent acceptance and captcha token presence
- computes deterministic email hash / fallback idempotency key
- creates an in-memory registration record with:
  - status=`pending`
  - current_state=`EmailVerificationPending`
  - 48h expiry
- rejects duplicate registration by email hash

### 3.2 Registration Status
- returns persisted in-memory registration status by `registration_id`
- returns domain error if registration not found

### 3.3 Resend Verification
- marks resend event in registration history (skeleton behavior)
- returns current status/state

### 3.4 Purge Unverified
- purges (marks expired) pending registrations past expiry (skeleton behavior)
- returns purge summary

## 4. Migration Draft (`0001`) Coverage
The draft migration defines tenant-domain-owned tables for:
- `tenant_reg.registration_requests`
- `tenant_reg.registration_state_transitions`
- `tenant_reg.idempotency_keys`
- `tenant_reg.webhook_receipts`
- `tenant_reg.consent_ledger`
- `tenant_reg.policy_decisions`
- `tenant_sec.registration_security_events`
- `tenant_gov.registration_governance_entries`
- `tenant_evt.outbox_events`

Notes:
- This migration was created as a draft in Phase 2 and not yet executed.
- It provides the structural target for later DB-backed repository replacement of the in-memory store.

## 5. Docker API Runtime Validation (service-gen-api)
Validation was performed in the `service-gen-api` container using the container venv interpreter style:
- `/app/.venv/bin/python ...`

### 5.1 Pytest Runtime Constraint
- Pytest hangs in this container if plugin autoload is enabled.
- Working command uses:
  - `PYTEST_DISABLE_PLUGIN_AUTOLOAD=1`

### 5.2 Unit Test Validation (passed)
Command:
```bash
docker exec service-gen-api sh -lc 'cd /app && PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 /app/.venv/bin/python -m pytest capabilities/tenant/tests/unit -q'
```
Result:
- `7 passed in 6.57s`

### 5.3 Route Smoke Validation (passed)
In-container FastAPI `TestClient` smoke checks validated:
- `GET /api/tenant/v1/health` -> 200
- `POST /api/tenant/v1/register` -> 200 (`pending`, `EmailVerificationPending`)
- `GET /api/tenant/v1/registrations/{id}` -> 200
- `POST /api/tenant/v1/resend-verification` -> 200
- `POST /api/tenant/v1/internal/purge-unverified` -> 200

Observed structured logs from `tenant.domain` confirmed domain API method calls:
- `tenant_domain_api.register_tenant`
- `tenant_domain_api.get_registration_status`
- `tenant_domain_api.resend_verification`
- `tenant_domain_api.purge`

## 6. Design Notes (Phase 2)
1. In-memory store is intentional to validate domain API/cap wiring before DB runtime integration and migrations are applied.
2. `0001` migration and ORM models are now aligned conceptually with the implementation plan, but repositories are still scaffold-level.
3. This phase establishes executable domain behavior for API-level testing while preserving clean progression to Keycloak/OPA in later phases.

## 7. Known Limitations (Expected Before Phase 3+)
1. No Keycloak provisioning/group/user/email verification integration yet.
2. No webhook receiver / verification callback handling yet.
3. No activation transition logic yet.
4. No rollback/compensation logic yet.
5. No OPA decisions/policy evidence yet.
6. DB repositories are not yet used by the runtime flow (memory store used instead).

## 8. Next Phase (Phase 3)
Planned next:
1. Keycloak adapter scaffold + webhook validation path
2. `verify_email_webhook` cap and route
3. activation transition skeleton
4. rollback/compensation skeleton
5. in-container tests and route validation
