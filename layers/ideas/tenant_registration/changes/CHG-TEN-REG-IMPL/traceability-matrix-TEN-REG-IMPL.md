# Tenant Registration Traceability Matrix (CHG-TEN-REG-IMPL)

## Implemented Code Summary (Section 1)

### Tenant Domain (implemented)
- Domain object + facade:
  - `capabilities/tenant/factory.py`
  - `capabilities/tenant/__init__.py`
- Contracts:
  - `capabilities/tenant/contracts/entities.py`
  - `capabilities/tenant/contracts/errors.py`
  - `capabilities/tenant/contracts/events.py`
- Shared runtime:
  - `capabilities/tenant/shared/state_machine.py`
  - `capabilities/tenant/shared/error_mapping.py`
  - `capabilities/tenant/shared/idempotency.py`
  - `capabilities/tenant/shared/event_signing.py`
  - `capabilities/tenant/shared/logging.py`
  - `capabilities/tenant/shared/memory_store.py`
- Caps / workflows:
  - `register_tenant`
  - `get_registration_status`
  - `resend_verification`
  - `verify_email_webhook`
  - `purge_unverified`
- DB adapter + repositories:
  - `capabilities/tenant/adapters/db/sql_store.py`
  - `capabilities/tenant/adapters/db/repositories/core_identity_projection_repository.py`
  - `capabilities/tenant/adapters/db/repositories/tenant_registration_repository.py`
  - `capabilities/tenant/adapters/db/models/*`
  - `capabilities/tenant/adapters/db/migrations/versions/0001_create_tenant_domain_tables.py`
- Integrations:
  - `capabilities/tenant/adapters/keycloak/identity_adapter.py`
  - `capabilities/tenant/adapters/keycloak/webhook_validator.py`
  - `capabilities/tenant/adapters/opa/policy_adapter.py`
  - `capabilities/tenant/policies/tenant_registration/*.rego`
- Runtime mount:
  - `app/ingress/api/main.py`

### SaaS integration (implemented)
- `ui-apps/service-gen-saas/lib/tenant-registration-client.ts`
- `ui-apps/service-gen-saas/app/onboarding/create/actions.ts`
- `ui-apps/service-gen-saas/app/onboarding/verify/actions.ts`

### E2E implementation (implemented)
- `ui-apps/service-gen-saas/playwright.config.ts`
- `ui-apps/service-gen-saas/tests/e2e/tenant-onboarding.spec.ts`
- `docker-compose.generated.yml` (`playwright-test` service)
- `vendor/playwright-test/entrypoint.sh`

## Implemented Tests Summary (Section 1)

### Tenant unit tests
- `capabilities/tenant/tests/unit/test_state_machine.py`
- `capabilities/tenant/tests/unit/test_factory_contract.py`
- `capabilities/tenant/tests/unit/test_phase2_registration_flow.py`
- `capabilities/tenant/tests/unit/test_phase3_webhook_activation.py`
- `capabilities/tenant/tests/unit/test_phase4_opa_and_ci_validators.py`
- `capabilities/tenant/tests/unit/test_phase8_pii_encryption.py`

### Tenant integration tests
- `capabilities/tenant/tests/integration/test_real_adapters_local.py`

### SaaS E2E tests
- `ui-apps/service-gen-saas/tests/e2e/tenant-onboarding.spec.ts`

## Traceability Matrix

| Spec/Test ID | Requirement / Control | Control Owner | Implemented Code | Implemented Test(s) | Validation Status |
|---|---|---|---|---|---|
| `REQ-TEN-REG-001` | Tenant registration creates tenant + admin path | Tenant Domain | `capabilities/tenant/caps/register_tenant/workflow.py`, `capabilities/tenant/adapters/db/sql_store.py`, `capabilities/tenant/adapters/db/repositories/core_identity_projection_repository.py` | `capabilities/tenant/tests/unit/test_phase2_registration_flow.py`, `ui-apps/service-gen-saas/tests/e2e/tenant-onboarding.spec.ts` | Implemented + validated |
| `REQ-TEN-REG-002` | Initial admin role assignment | Tenant Domain + Keycloak | `core_identity_projection_repository.py` (role owner), `identity_adapter.py` | `test_phase2_registration_flow.py`, live runtime validation (DB row role=`owner`) | Implemented + runtime validated |
| `REQ-TEN-REG-003` | Email verification workflow | Keycloak + Tenant Domain | `verify_email_webhook/workflow.py`, `webhook_validator.py`, `identity_adapter.py` | `test_phase3_webhook_activation.py`, live signed webhook checks | Implemented + validated |
| `WF-TEN-REG` (`v0.8.1`) | Registration state machine progression | Tenant Domain | `shared/state_machine.py`, `register_tenant/workflow.py`, `verify_email_webhook/workflow.py` | `test_state_machine.py`, route smoke/live flow checks | Implemented + validated |
| `TC-TEN-REG-004` | Duplicate registration / idempotency handling | Tenant Domain | `shared/idempotency.py`, `shared/memory_store.py`, `adapters/db/sql_store.py` | `test_phase2_registration_flow.py` | Implemented (skeleton + SQL path) |
| `TC-PRV-TEN-REG-001` | Consent persistence | Tenant Domain | `sql_store.py` (`tenant_reg.policy_decisions` + registration persistence path; consent payload handling in register workflow) | `test_phase2_registration_flow.py` (flow assertions), live DB persistence checks | Partially implemented (payload + persistence path), additional explicit consent ledger assertions recommended |
| `TC-PRV-TEN-REG-002` | Data minimization | Tenant Domain | `contracts/entities.py`, register handler/workflow payload use | Unit flow tests + code review | Implemented (scope-limited) |
| `TC-PRV-TEN-REG-003` | Tenant isolation initialization | Tenant Domain | `core_identity_projection_repository.py`, `sql_store.py` | live DB verification of tenant/org/user linkage | Implemented + runtime validated |
| `TC-SEC-TEN-REG-001` | Password hashing verification | Keycloak (IdP) | `identity_adapter.py` (real Keycloak provisioning), compose/env integration | `test_real_adapters_local.py` (adapter path) + live Keycloak admin token/provisioning checks | Owner = Keycloak, integration validated |
| `TC-SEC-TEN-REG-002` | Rate limiting / anti-abuse gate | Tenant Domain | `register_tenant/tasks.py` / workflow gating (skeleton), OPA gate support | `test_phase4_opa_and_ci_validators.py` (OPA path) | Partially implemented (OPA enforcement + skeleton anti-abuse) |
| `TC-SEC-TEN-REG-003` | SQL injection prevention | Tenant Domain | SQLAlchemy repos (`sql_store.py`, repositories) | unit/integration flow tests + ORM usage | Implemented by design; no dedicated malicious payload test yet |
| `TC-SEC-TEN-REG-004` | Audit/security event verification | Tenant Domain | `verify_email_webhook/workflow.py`, `sql_store.py` (webhook receipts / replay evidence), policy decision persistence | `test_phase3_webhook_activation.py`, live replay test (`409`) | Implemented (security event evidence path present) |
| `RISK-TEN-REG-2026-001` | Bot abuse mitigation | Tenant Domain + OPA | `adapters/opa/policy_adapter.py`, register workflow deny enforcement | `test_phase4_opa_and_ci_validators.py` | Partially implemented (OPA deny path); captcha/rate limiter adapters still follow-up |
| `RISK-TEN-REG-2026-002` | Unauthorized activation / replay | Tenant Domain + Keycloak | `verify_email_webhook/workflow.py`, `webhook_validator.py`, `sql_store.py` (`WebhookReceipt`) | `test_phase3_webhook_activation.py` (replay unit), live duplicate webhook check (`409`) | Implemented + validated |
| `NFR-TEN-REG-002` (Keycloak-adjusted) | Password hashing policy owner evidence | Keycloak | `identity_adapter.py` real admin mode integration | `test_real_adapters_local.py` + runtime checks | Integration validated; policy introspection test can be extended |
| `CI/CD domain checks` | Workflow/traceability/factory/OPA validations | Tenant Domain | `capabilities/tenant/ci/scripts/*.py`, `specs_manifest.yml` | `test_phase4_opa_and_ci_validators.py` | Implemented (script presence + validator path checks) |

## Execution Evidence References

- Phase logs:
  - `af-iclme/layers/ideas/tenant_registration/IP/walkthrough_ph1.md` ... `walkthrough_ph12.md`
- Consolidated implementation walkthrough:
  - `af-iclme/layers/ideas/tenant_registration/changes/CHG-TEN-REG-IMPL/walkthrough-TEN-REG-IMPL`
- Change summary:
  - `af-iclme/layers/ideas/tenant_registration/changes/CHG-TEN-REG-IMPL/change-TEN-REG-IMPL`

