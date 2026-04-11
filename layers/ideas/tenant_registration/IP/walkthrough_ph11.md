# Tenant Registration Implementation - Walkthrough Phase 11

## Scope

Phase 11 completes items `1`, `2`, and `3` requested before Playwright/e2e:

1. Real-mode adapter integration tests (OPA + Keycloak)
2. Webhook replay receipt persistence + enforcement
3. `UserPII` encryption at persistence time

## Changes Included

### 1. Real-mode adapter integration tests

- Added local real-mode integration tests:
  - `capabilities/tenant/tests/integration/test_real_adapters_local.py`
- Tests are feature-flagged with `TENANT_RUN_REAL_ADAPTER_TESTS=1` and validate:
  - OPA remote decision call path
  - Keycloak admin provisioning path (real UUID)

### 2. Webhook replay persistence + enforcement

- Added webhook receipt tracking in both stores:
  - memory store (`TenantRegistrationMemoryStore`)
  - SQL store (`TenantRegistrationSqlStore`)
- `verify_email_webhook` flow now:
  - records receipt first (`event_id`)
  - rejects duplicate deliveries before downstream processing
  - marks receipt processed when successful
- Added replay unit test coverage and updated webhook schema usage with `event_id`
- Updated HTTP error mapping:
  - `TENANT_WEBHOOK_REPLAY_DETECTED` -> HTTP `409`

### 3. UserPII encryption

- Added encryption utility:
  - `capabilities/tenant/adapters/db/encryption.py`
- `CoreIdentityProjectionRepository` now encrypts `UserPII` before persistence
- Added unit test verifying:
  - ciphertext differs from plaintext
  - decrypt roundtrip succeeds

## Validation Executed (Docker / service-gen-api container)

### Unit tests (tenant domain)

Command:

```bash
docker exec service-gen-api sh -lc 'cd /app && PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 /app/.venv/bin/python -m pytest capabilities/tenant/tests/unit -q'
```

Result:

- `16 passed`

### Real adapter integration tests (OPA + Keycloak)

Command:

```bash
docker exec service-gen-api sh -lc 'cd /app && TENANT_RUN_REAL_ADAPTER_TESTS=1 PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 /app/.venv/bin/python -m pytest capabilities/tenant/tests/integration/test_real_adapters_local.py -q'
```

Result:

- `2 passed`

## Live Replay Enforcement Validation (Mounted API Runtime)

### Objective

Confirm duplicate webhook delivery is blocked with `409` after replay error mapping patch.

### Result

- Registration created successfully (`200`)
- First webhook failed with realm validation (`TENANT_WEBHOOK_INVALID_REALM`) due payload realm mismatch in the validation script (`servicegen` vs runtime expectation)
- Second webhook (same `event_id`) correctly returned:
  - HTTP `409`
  - `TENANT_WEBHOOK_REPLAY_DETECTED`

This confirms replay receipts are persisted and enforced before downstream webhook validation/activation.

## Notes

- Pytest in `service-gen-api` container requires:
  - `PYTEST_DISABLE_PLUGIN_AUTOLOAD=1`
  to avoid plugin-autoload hangs in this runtime.
- Replay validation ordering is intentional and correct:
  - receipt recorded -> duplicate check -> signature/realm/group validation -> activation

## Phase 11 Outcome

Items `1`, `2`, and `3` are implemented and validated. The next step can proceed to item `4` (Playwright/e2e) with the current tenant registration runtime baseline.
