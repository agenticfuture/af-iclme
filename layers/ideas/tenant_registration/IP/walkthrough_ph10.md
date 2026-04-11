# Tenant Registration - Phase 10 Walkthrough (Real OPA + Real Keycloak Admin Runtime Integration)

## Scope
- Enabled **real OPA runtime evaluation** in Docker Compose for the tenant registration flow.
- Enabled **real Keycloak Admin API provisioning** in the tenant Keycloak adapter (local runtime).
- Preserved safe fallback behavior when real integrations are unavailable.
- Validated end-to-end registration + verification flow with:
  - real OPA decision calls
  - real Keycloak user provisioning
  - DB evidence showing real Keycloak UUIDs persisted

## Key Problems Identified and Fixed

### 1) OPA container unreachable from `service-gen-api`
**Cause**
- `sg_opa` was listening on `localhost:8181` only
  - log showed: `addrs:["localhost:8181"]`
- Result: `service-gen-api` could not reach `http://opa:8181`

**Fix**
- Updated OPA compose command to bind all interfaces:
  - `run --server --addr=0.0.0.0:8181 /policies`

### 2) OPA policies were missing
**Cause**
- `./policies` directory was empty, so even reachable OPA would not have tenant registration policy paths.

**Fix**
- Added minimal allow policies for tenant registration decision points:
  - `policies/api_boundary.rego`
  - `policies/consent.rego`
  - `policies/activation.rego`
  - `policies/keycloak_binding.rego`
  - `policies/governance.rego`

### 3) `KEYCLOAK_ADMIN_PASSWORD` was blank in `service-gen-api`
**Cause**
- A compose `environment:` interpolation override (`${KEYCLOAK_ADMIN_PASSWORD}`) was evaluated before env files and resolved to empty.

**Fix**
- Removed those explicit interpolation overrides and relied on:
  - `./vendor/keycloak/.env.secrets` in `service-gen-api` `env_file`

### 4) Keycloak Admin API fallback still happening (realm mismatch)
**Cause**
- Adapter used `KEYCLOAK_REALM=servicegen-saas` as admin target realm
- Local Keycloak only had `master` realm
- Admin API group/user calls returned `404 Realm not found`

**Fix**
- Added support for `KEYCLOAK_ADMIN_TARGET_REALM`
- Set in compose for `service-gen-api`:
  - `KEYCLOAK_ADMIN_TARGET_REALM: master`

### 5) Keycloak admin token requests timing out
**Cause**
- Adapter timeout too short for local Keycloak startup/runtime behavior

**Fix**
- Increased Keycloak adapter default timeout to `10s`

### 6) Real group membership validation would fail without actual group assignment
**Cause**
- Adapter could create/get users but did not add them to the tenant group
- webhook validation path checks user/group membership

**Fix**
- Implemented group lookup and user-group assignment in Keycloak adapter:
  - `_get_group(...)`
  - `_ensure_user_in_group(...)`

## Files Modified

### Compose / Runtime
- `docker-compose.generated.yml`
  - `service-gen-api`:
    - add `./vendor/keycloak/.env.secrets` to `env_file`
    - add `OPA_URL=http://opa:8181`
    - add `KEYCLOAK_INTERNAL_URL=http://keycloak:8080`
    - add `KEYCLOAK_ADMIN_TARGET_REALM=master`
  - `opa`:
    - bind to `0.0.0.0:8181`

### OPA Policies
- `policies/api_boundary.rego`
- `policies/consent.rego`
- `policies/activation.rego`
- `policies/keycloak_binding.rego`
- `policies/governance.rego`

### Tenant Adapters / Flow
- `capabilities/tenant/adapters/opa/policy_adapter.py`
  - real HTTP OPA path + fail-closed support
- `capabilities/tenant/adapters/keycloak/identity_adapter.py`
  - real admin API mode (token/group/user/verify-email/membership)
  - admin target realm support
  - timeout tuning
  - group assignment support
- `capabilities/tenant/factory.py`
  - OPA deny enforcement in registration flow

### Tests
- `capabilities/tenant/tests/unit/test_phase4_opa_and_ci_validators.py`
  - OPA fail-closed behavior
  - OPA deny -> tenant registration denied

## Validation Performed

### A. Unit Tests (API container)
Command:
```bash
docker exec service-gen-api sh -lc 'cd /app && PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 /app/.venv/bin/python -m pytest capabilities/tenant/tests/unit -q'
```

Observed:
- `14 passed`

### B. OPA Connectivity + Real Policy Paths (API container)
Validated from `service-gen-api`:
- `http://opa:8181/health` -> `200`
- `POST /v1/data/api_boundary/registration_request_allowed` -> `{"result":{"allow":true}}`
- `POST /v1/data/consent/required_consent_matrix` -> `{"result":{"allow":true}}`
- `POST /v1/data/activation/tenant_activation_gate` -> `{"result":{"allow":true}}`

### C. Keycloak Admin API Probe (API container)
Validated:
- admin token acquisition works with `admin/pwd`
- admin realms endpoint returns `master`
- realm mismatch fixed by `KEYCLOAK_ADMIN_TARGET_REALM=master`

### D. Real Adapter Runtime Behavior (API container)
Observed from direct adapter checks:
- OPA adapter returns: `OPA remote decision.`
- Keycloak adapter `create_admin_user(...)` returns **real UUID** (not skeleton `kc_...`)

### E. Live End-to-End Tenant Flow (Real Runtime)
Executed live registration + signed webhook verification flow in `service-gen-api` with retries (to tolerate dev reloader restarts).

Observed:
- register -> `pending / EmailVerificationPending`
- webhook -> `200`, `TenantActivated`
- final status -> `active / TenantActivated`

DB evidence after live flow:
- `tenant_reg.registration_requests.keycloak_user_id` = real Keycloak UUID
- `core.users.external_id` = same real Keycloak UUID
- `tenant_reg.policy_decisions` present with expected rules:
  - `registration_request_allowed`
  - `required_consent_matrix`
  - `tenant_activation_gate`

## Example Runtime Evidence (Observed)
- `opa True allow OPA remote decision.`
- `kc_create_admin_user_probe 6439c081-18fc-46aa-b58e-0403f213cebc`
- `db-reg-keycloak-user-id 5328f886-0deb-414f-9f02-253c7d32ccc8`
- `db-user-external-id 5328f886-0deb-414f-9f02-253c7d32ccc8`

## Outcome
- Tenant registration now runs with **real OPA policy evaluation** and **real Keycloak admin provisioning** in the local Docker runtime.
- Fallback behavior remains available for degraded environments.
- This completes the major runtime integration milestone for tenant registration before browser e2e.

## Next Phase (Recommended)
- Add integration tests that assert real adapter mode (feature-flagged/local-only)
- Add webhook replay receipt persistence + enforcement in DB-backed flow
- Implement stronger encryption for `private.user_pii` (replace placeholder bytes)
- Add Playwright e2e onboarding flow (`saas -> tenant register -> verify page -> webhook simulation -> active state`)
