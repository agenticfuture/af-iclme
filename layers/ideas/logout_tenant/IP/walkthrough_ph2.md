# Logout Tenant - Phase 2 Walkthrough (Implementation + Verification)

Date: 2026-02-28

## Scope completed
- Implemented `logout_tenant` capability end-to-end in tenant domain.
- Wired API route in tenant factory with gateway policy and auth claim checks.
- Added real token revocation persistence and gateway replay denial checks.
- Implemented SaaS logout route with CSRF validation, cookie cleanup, and browser clear-site-data headers.
- Verified with real backend tests and real browser e2e (non-mock credentials).

## Implementation highlights
- Tenant cap files added under `capabilities/tenant/caps/logout_tenant`:
  - `entities.py`, `functions.py`, `workflow.py`, `handler.py`, `__init__.py`
- Contracts extended in `capabilities/tenant/contracts/entities.py`:
  - `LogoutTenantRequest`, `LogoutTenantResponse`
- Factory route and domain API wired in `capabilities/tenant/factory.py`:
  - `POST /api/tenant/v1/logout`
- Error mapping updated in `capabilities/tenant/shared/error_mapping.py`.

## Security/privacy controls completed
- Gateway JWT validation enabled for auth-required routes (`SESSION_SECRET`).
- Revoked session replay denied in gateway via revocation store lookup.
- Logout endpoint verifies auth subject against payload subject.
- Logout origin/referer allowlist enforcement in tenant factory route.
- SaaS logout uses CSRF token (`sg_logout_csrf`) and clears cookies + site data.

## DB persistence additions
- Added model `tenant_sec.revoked_session_tokens` in:
  - `capabilities/tenant/adapters/db/models/registration.py`
- Added store methods in:
  - `capabilities/tenant/adapters/db/sql_store.py`
  - `capabilities/tenant/shared/memory_store.py`

## Test execution (real)

### 1) Real browser e2e (logout)
Command:
```bash
docker compose -f docker-compose.generated.yml exec -T playwright-test \
  sh -lc 'cd /work && E2E_LOGIN_EMAIL=test@servicegen.com E2E_LOGIN_PASSWORD="ServiceGen123!" pnpm -s playwright test tests/e2e/logout-flow.spec.ts'
```
Result: `1 passed`

### 2) Backend test subset (gateway + tenant logout)
Command:
```bash
docker compose -f docker-compose.generated.yml exec -T service-gen-api \
  /app/.venv/bin/python -m pytest -q \
  /app/tests/test_gateway_policy_middleware.py \
  /app/tests/test_request_context.py \
  /app/capabilities/tenant/tests/unit/test_logout_tenant_flow.py \
  /app/capabilities/tenant/tests/unit/test_factory_contract.py
```
Result: `16 passed`

## Notes
- E2E uses real Keycloak account credentials, no mock session.
- A deterministic test password was set for `test@servicegen.com` in realm `saas-servicegen` to stabilize CI/dev e2e:
  - password: `ServiceGen123!`
