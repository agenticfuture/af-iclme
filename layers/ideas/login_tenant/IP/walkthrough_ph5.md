# login_tenant - Walkthrough Phase 5 (UI E2E wiring)

Date: 2026-02-26

## Objective
Validate end-to-end UI wiring from SaaS auth actions through Keycloak callback, tenant scope resolution, API persistence checks, and dashboard load.

## Code updates

### 1) Auth callback support for first-time registration path
- `ServiceGen/capabilities/auth/caps/handle_auth/functions.py`
  - `enforce_tenant_login_scope(...)` now supports `allow_unprovisioned` for first-time callback path.
- `ServiceGen/capabilities/auth/caps/handle_auth/workflow.py`
  - propagated `allow_unprovisioned` through task/flow.
- `ServiceGen/capabilities/auth/caps/handle_auth/api.py`
  - callback request now accepts `allow_unprovisioned: bool` and forwards it to workflow.

### 2) Deterministic login/register flow signaling from UI
- `ServiceGen/ui-apps/service-gen-saas/lib/keycloak-client.ts`
  - added `sg_auth_flow` cookie (`login` or `register`) before redirecting to Keycloak.
- `ServiceGen/ui-apps/service-gen-saas/app/auth/callback/route.ts`
  - reads `sg_auth_flow` and enables unprovisioned handling only for register flow.
  - clears `sg_auth_flow` after callback.

### 3) Login status handling adjustment
- `ServiceGen/capabilities/tenant/caps/login_tenant/functions.py`
  - blocks explicit inactive statuses (`suspended|disabled|archived|deleted|blocked`), allowing pending-but-not-blocked statuses for callback/onboarding transitions.

### 4) Tests added/updated
- `ServiceGen/ui-apps/service-gen-saas/tests/e2e/full-signin-existing-user.spec.ts`
  - real browser test:
    - register user
    - click Sign In from home
    - authenticate via Keycloak
    - callback -> dashboard
    - verify scoped session context
    - verify tenant registration status endpoint
    - verify scoped services endpoint loads
- Existing E2E retained:
  - `ServiceGen/ui-apps/service-gen-saas/tests/e2e/full-signup-to-db-save.spec.ts`

## Runtime checks performed

### Environment/runtime validation
- Verified `.env.secrets` contains concrete key:
  - `ENCRYPTION_KEY=...` (44 chars)
- Restarted only API as requested and revalidated runtime:
  - `ENCRYPTION_KEY=set`, `LEN=44` in `service-gen-api` container.

### Unit checks
- Auth unit tests:
  - `capabilities/auth/tests/unit/test_handle_auth_functions.py`
  - `capabilities/auth/tests/unit/test_handle_auth_api.py`
  - Result: `8 passed`
- Tenant login unit tests:
  - `capabilities/tenant/tests/unit/test_login_tenant_flow.py`
  - `capabilities/tenant/tests/unit/test_login_rate_limit.py`
  - Result: `5 passed`

### Browser E2E checks (Playwright in docker runner)
- Signup full flow:
  - `tests/e2e/full-signup-to-db-save.spec.ts`
  - Result: `1 passed` (latest run: 8.3s)
- Sign-in button full flow:
  - `tests/e2e/full-signin-existing-user.spec.ts`
  - Result: `1 passed` (latest run: 20.1s)

## What is validated end-to-end now
- UI click path for register/sign-in.
- Keycloak redirect/auth pages and callback round-trip.
- Backend auth callback exchange and session cookie issuance.
- Tenant login scope resolution in API flow.
- Post-callback session scope retrieval (`/api/session-context`).
- Tenant registration persistence/status readback via API (`/api/tenant/v1/registrations/{id}`).
- Dashboard load success in authenticated path.
- Scoped services API call success with tenant/org query context.

## Notes
- Test execution uses real running services in compose (`service-gen-saas`, `service-gen-api`, `keycloak`, `traefik`, `playwright-test`, etc.), not mocked browser/API responses for the full-flow tests above.
