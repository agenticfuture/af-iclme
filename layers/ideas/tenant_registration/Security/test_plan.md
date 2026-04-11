# Tenant Registration - Security Layer Test Plan
Version: 1.0.0
Layer: Security (L5)
Idea: tenant_registration
Status: Executed (validated run)

## 1. Objective
Validate the implemented security controls for the tenant registration capability against the current architecture (Keycloak as IdP, OPA policy decision layer, tenant DB adapter).

## 2. Security Scope (Current Code State)
In scope for this phase:
- Webhook signature validation and replay detection
- OPA policy enforcement and fail-closed behavior
- PII encryption utility and real encryption-at-rest verification in tenant DB
- Real OPA and Keycloak adapter connectivity/behavior checks
- Real API rate limiting (5 per IP/hour -> 429)
- SQL injection handling via registration endpoint
- Security event persistence (`tenant_sec.registration_security_events`)
- Keycloak password storage verification (hash stored in Keycloak DB, not plaintext)
- SaaS anti-framing response headers (`X-Frame-Options`, CSP `frame-ancestors`) to prevent iframe embedding

Control ownership note:
- Password hashing is owned by Keycloak (IdP), not tenant domain DB. Security validation therefore checks Keycloak credential storage behavior in the Keycloak DB.

## 3. Security Test Inventory
### 3.1 Unit / Local Security Controls
- `capabilities/tenant/tests/unit/test_phase3_webhook_activation.py`
- `capabilities/tenant/tests/unit/test_phase4_opa_and_ci_validators.py`
- `capabilities/tenant/tests/unit/test_phase8_pii_encryption.py`

### 3.2 Real Adapter Security Integration
- `capabilities/tenant/tests/integration/test_real_adapters_local.py`

### 3.3 Real Security Flow Integration (new)
- `capabilities/tenant/tests/integration/test_security_real_flow_local.py`
  - rate limit 429
  - SQL injection literal handling
  - security event persistence
  - PII encrypted-at-rest (DB)
  - Keycloak password hash storage (Keycloak DB)

### 3.4 SaaS Web Security Header Validation
- `ui-apps/service-gen-saas/tests/e2e/security-headers.spec.ts`
  - verifies SaaS response denies iframe embedding

## 4. Acceptance Criteria
- All Security-layer tests pass
- 6th registration request from same IP returns 429
- SQL injection payload does not corrupt DB and is treated safely
- Security events are persisted with correlation + IP for successful registration
- PII is stored encrypted-at-rest in `private.user_pii`
- Keycloak `credential` row stores hashed password metadata; plaintext password is not present

## 5. Execution Command (validated)
`docker exec service-gen-api sh -lc 'cd /app && PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 TENANT_RUN_REAL_ADAPTER_TESTS=1 /app/.venv/bin/python -m pytest capabilities/tenant/tests/unit/test_phase3_webhook_activation.py capabilities/tenant/tests/unit/test_phase4_opa_and_ci_validators.py capabilities/tenant/tests/unit/test_phase8_pii_encryption.py capabilities/tenant/tests/integration/test_real_adapters_local.py capabilities/tenant/tests/integration/test_security_real_flow_local.py -q'`

## 6. Additional Web Security Validation Command (validated)
`docker exec playwright-test sh -lc 'cd /work && export NODE_PATH=$(npm root -g) PLAYWRIGHT_OUTPUT_DIR=/tmp/pw-output PLAYWRIGHT_ARTIFACT_DIR=/tmp/pw-artifacts && timeout 300s playwright test tests/e2e/security-headers.spec.ts --reporter=line --workers=1 --output=/tmp/pw-output'`
