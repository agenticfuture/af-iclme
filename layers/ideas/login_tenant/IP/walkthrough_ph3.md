# login_tenant - Walkthrough Phase 3

Date: 2026-02-26

## Phase goal
Implement login anti-abuse controls (attempt tracking + lockout/rate limiting) for `login_tenant` and validate behavior.

## Code updates
- Added dedicated login attempt guard:
  - `ServiceGen/capabilities/tenant/shared/rate_limit.py`
  - New classes:
    - `LoginGuardDecision`
    - `InMemoryLoginAttemptGuard`
  - Features:
    - fixed-window attempt counting
    - lockout after threshold
    - retry-after support
    - success reset
- Wired login guard into tenant domain API:
  - `ServiceGen/capabilities/tenant/factory.py`
  - `TenantDomainDependencies` now includes `login_guard`
  - `TenantDomainAPI.login_tenant(...)` now:
    - checks lockout before executing login flow
    - records failed attempts on login-domain failures
    - escalates to `TENANT_LOGIN_RATE_LIMITED` when threshold reached
    - resets counter on success
    - emits `TENANT_LOGIN_FAILED`, `TENANT_LOGIN_RATE_LIMITED`, `TENANT_LOGIN_SUCCEEDED` security events
  - Added env configuration:
    - `TENANT_LOGIN_MAX_ATTEMPTS` (default `5`)
    - `TENANT_LOGIN_WINDOW_SECONDS` (default `300`)
    - `TENANT_LOGIN_LOCKOUT_SECONDS` (default `900`)
  - Route response contract update:
    - `POST /api/tenant/v1/login/resolve` now includes `429`
- Added HTTP mapping for lockout error:
  - `ServiceGen/capabilities/tenant/shared/error_mapping.py`
  - `TENANT_LOGIN_RATE_LIMITED -> 429`

## Tests added
- `ServiceGen/capabilities/tenant/tests/unit/test_login_rate_limit.py`
  - validates guard lock behavior
  - validates domain-level lockout after repeated failures

## Validation executed (inside docker service-gen-api)
- `python -m pytest -q capabilities/tenant/tests/unit/test_login_rate_limit.py capabilities/tenant/tests/unit/test_login_tenant_flow.py`
  - Result: `5 passed`
- `python -m pytest -q capabilities/tenant/tests/unit capabilities/auth/tests/unit/test_handle_auth_functions.py capabilities/auth/tests/unit/test_handle_auth_api.py`
  - Result: `28 passed`

## Notes
- This phase adds deterministic anti-bruteforce behavior for login resolution at tenant domain boundary.
- Compose warns `ENCRYPTION_KEY` unset; not blocking these tests but should be set for security-layer completeness.
