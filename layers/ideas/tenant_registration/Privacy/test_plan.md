# Tenant Registration - Privacy Layer Test Plan
Version: 1.0.0
Layer: Privacy (L4)
Idea: tenant_registration
Status: Executed (validated run)

## 1. Objective
Validate the implemented privacy controls for tenant registration against the current architecture and code state.

## 2. Privacy Scope (Current Code State)
In scope for this phase:
- Consent capture and persistence in `tenant_reg.consent_ledger`
- Data minimization in registration contract and registration persistence schema
- Tenant isolation at registration/projection assignment (unique tenant/org/user linkage)
- Unverified registration retention/purge behavior (48h timeout -> purge draft projections)
- PII encryption-at-rest verification (cross-layer dependency; already validated in Security layer)

Out of scope (tracked backlog):
- Full retention engine integration beyond tenant registration purge path
- Advanced privacy evidence automation/reporting across domains
- Cross-tenant query access controls beyond registration/projection flow (broader auth/data access layer)

## 3. Privacy Test Inventory
### 3.1 Real Privacy Flow Integration
- `capabilities/tenant/tests/integration/test_privacy_real_flow_local.py`
  - `test_privacy_consent_record_persisted`
  - `test_privacy_data_minimization_registration_contract_and_schema`
  - `test_privacy_tenant_isolation_unique_tenant_assignment`
  - `test_privacy_unverified_registration_purge_deletes_draft_projections`

### 3.2 Supporting Cross-Layer Validation (Referenced)
- PII encryption-at-rest in DB is covered in Security layer:
  - `capabilities/tenant/tests/integration/test_security_real_flow_local.py::test_security_pii_is_encrypted_at_rest_in_db`

## 4. Acceptance Criteria
- Consent ledger row is written on successful registration
- Registration contract/schema do not collect/store unnecessary PII fields for initial registration
- Two registrations create distinct tenant/org/user projections
- Purge path expires the registration and deletes draft tenant/org/user/user_pii projections

## 5. Execution Command (validated)
`docker exec service-gen-api sh -lc 'cd /app && PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 TENANT_RUN_REAL_ADAPTER_TESTS=1 /app/.venv/bin/python -m pytest capabilities/tenant/tests/integration/test_privacy_real_flow_local.py -q'`
