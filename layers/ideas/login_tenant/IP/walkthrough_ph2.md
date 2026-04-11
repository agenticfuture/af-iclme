# login_tenant - Walkthrough Phase 2

Date: 2026-02-26

## Phase goal
Enforce tenant-domain login scope in auth callback flow and harden session/cookie behavior before issuing user session tokens.

## Code updates
- Enforced tenant scope during auth workflow:
  - `ServiceGen/capabilities/auth/caps/handle_auth/functions.py`
  - Added `enforce_tenant_login_scope(user, identity, correlation_id)`:
    - Calls tenant domain API `login_tenant`
    - Validates active user + tenant/org scope
    - Returns scoped user payload for session issuance
- Hardened session token generation:
  - `ServiceGen/capabilities/auth/caps/handle_auth/functions.py`
  - `create_session` now:
    - fails fast if `SESSION_SECRET` missing
    - adds `iat`, `exp`, `jti`, `status` claims
    - supports `SESSION_TTL_SECONDS` (default 86400)
- Auth workflow now includes scope enforcement step:
  - `ServiceGen/capabilities/auth/caps/handle_auth/workflow.py`
  - Added `task_scope` before session creation
  - Propagates callback `correlation_id`
- Callback API cookie hardening:
  - `ServiceGen/capabilities/auth/caps/handle_auth/api.py`
  - Added `_resolve_cookie_security(request)`
  - Configurable settings:
    - `AUTH_SESSION_COOKIE_SECURE`
    - `AUTH_SESSION_COOKIE_SAMESITE` (`lax|strict|none`, defaults to `lax`)
    - `AUTH_SESSION_MAX_AGE_SECONDS` (default 86400)
    - `AUTH_SESSION_COOKIE_DOMAIN` (optional)
  - Callback now maps `TenantDomainError` to HTTP response via tenant error mapping

## Tests added/updated
- Updated auth function unit tests:
  - `ServiceGen/capabilities/auth/tests/unit/test_handle_auth_functions.py`
  - Added:
    - scope enforcement mapping test
    - missing `SESSION_SECRET` negative test
- Added API cookie security tests:
  - `ServiceGen/capabilities/auth/tests/unit/test_handle_auth_api.py`

## Validation executed (inside docker service-gen-api)
- `python -m pytest -q capabilities/auth/tests/unit/test_handle_auth_functions.py capabilities/auth/tests/unit/test_handle_auth_api.py`
  - Result: `7 passed`
- `python -m pytest -q capabilities/tenant/tests/unit`
  - Result: `19 passed`

## Notes
- Runtime warns `ENCRYPTION_KEY` is unset in compose env; unrelated to this phase test pass, but should be set for security controls in later phases.
- `workflow.md`/`workflow.yml` are still absent for `login_tenant`; implementation continues against available requirement/security/privacy/risk docs and plan v1.0.0.
