# Tenant Registration - Phase 9 Walkthrough (Keycloak/OPA Adapter Hardening with Safe Fallback)

## Scope
- Hardened `tenant` domain Keycloak and OPA adapters to support env-driven real HTTP integration while preserving current runnable behavior through safe fallback.
- Enforced OPA deny decisions in the tenant registration flow.
- Added unit tests for OPA fail-closed and policy-deny behavior.

## Files Modified

### OPA Adapter
- `capabilities/tenant/adapters/opa/policy_adapter.py`
  - Added env-driven `OPA_URL` support
  - Added remote OPA evaluation via HTTP (`httpx`)
  - Added fail-closed behavior when OPA is configured but unreachable
  - Added `simulated_denies` for deterministic unit testing
  - Preserved fallback allow behavior when OPA is not configured

### Keycloak Identity Adapter
- `capabilities/tenant/adapters/keycloak/identity_adapter.py`
  - Added env-driven admin config support:
    - `KEYCLOAK_ADMIN_URL` / `KEYCLOAK_ADMIN_BASE_URL` / `KEYCLOAK_INTERNAL_URL`
    - `KEYCLOAK_ADMIN_USERNAME` / `KEYCLOAK_ADMIN`
    - `KEYCLOAK_ADMIN_PASSWORD`
    - `KEYCLOAK_ADMIN_CLIENT_ID`
  - Added optional real Admin API methods (token, group ensure, user create/get, send verify email, group membership check)
  - Preserved deterministic skeleton fallback when admin API is unavailable/misconfigured

### Tenant Domain Flow Enforcement
- `capabilities/tenant/factory.py`
  - Registration flow now raises `TenantRegistrationPolicyDeniedError` if OPA decision returns deny

### Tests
- `capabilities/tenant/tests/unit/test_phase4_opa_and_ci_validators.py`
  - added:
    - OPA fail-closed remote-unreachable test
    - registration flow policy-deny test

## Runtime Environment Observations (API container)
Checked in `service-gen-api` container:
- `KEYCLOAK_BASE_URL=https://auth.servicegen.local`
- `KEYCLOAK_REALM=servicegen-saas`
- `KEYCLOAK_CLIENT_ID=saas-servicegen`
- `DATABASE_URL=postgresql://servicegen_api:...@postgres:5432/servicegen`
- `opa:8181` not reachable (OPA service not running in this compose stack)
- `keycloak:8080` reachable

This means current runtime behavior is:
- Keycloak adapter may attempt admin API mode only if admin creds are available
- OPA adapter falls back (OPA not configured/running) unless explicitly configured to fail-closed

## Validation - Unit Tests (API container)
Executed:

```bash
docker exec service-gen-api sh -lc 'cd /app && PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 /app/.venv/bin/python -m pytest capabilities/tenant/tests/unit -q'
```

Observed:
- `14 passed`

This includes:
- OPA fail-closed behavior test
- OPA deny enforcement in registration flow

## Validation - Live API Flow (Real Runtime, Hardened Adapters)
Ran live tenant flow against the real API runtime after hardening:
- `GET /api/tenant/v1/health`
- `POST /api/tenant/v1/register`
- `POST /api/tenant/v1/verify-email-webhook` (signed)
- `GET /api/tenant/v1/registrations/{id}`

Observed:
- `health` -> `200`
- webhook activation path -> `200`
- final registration status -> `active / TenantActivated`

### Note on Runtime Latency
The live flow took longer than earlier phases because the hardened Keycloak adapter now attempts real admin API integration first (env-driven) before falling back to skeleton behavior when full admin credentials/config are not available.

## Outcome
- Keycloak and OPA adapters are now enterprise-oriented in shape (real HTTP integration paths + config-driven behavior).
- Current compose runtime remains functional via fallback mode.
- OPA deny enforcement is now part of the tenant registration flow contract and is tested.

## Next Phase (Recommended)
- Implement real Keycloak admin credentials/config for actual group/user provisioning and verify-email calls
- Add real OPA service and policy endpoints (`OPA_URL`) to compose/k8s and validate allow/deny branches end-to-end
- Add integration tests for fallback vs real adapter modes
- Begin e2e flow automation (SaaS -> API -> verify path), then Playwright browser tests
