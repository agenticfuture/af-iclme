# Tenant Registration - Security Layer Traceability Report
Version: 1.0.0
Layer: Security (L5)
Idea: tenant_registration
Status: PASS (implemented security scope)

## 1. Traceability Matrix (Security)
| Security Spec / Test Case | Control | Implemented Code (Representative) | Tests / Validation | Status |
|---|---|---|---|---|
| `SEC-TEN-REG-001` / `TC-SEC-TEN-REG-001` | Password hashing for initial identity (Keycloak-owned) | `capabilities/tenant/adapters/keycloak/identity_adapter.py` (provisioning path); Keycloak DB `credential` storage (runtime) | `test_security_keycloak_stores_password_hash_not_plaintext` | PASS |
| `SEC-TEN-REG-002` / `TC-SEC-TEN-REG-002` | Rate limiting (5/IP/hour) | `capabilities/tenant/shared/rate_limit.py`, `capabilities/tenant/factory.py` (API register path enforcement) | `test_security_rate_limit_real_api_returns_429_after_five` | PASS |
| `SEC-TEN-REG-002` | CAPTCHA presence enforcement | `capabilities/tenant/caps/register_tenant/tasks.py` | tenant unit tests (validation path in backend suite) | PASS |
| `SEC-TEN-REG-003` / `TC-SEC-TEN-REG-003` | Input sanitization / SQL injection prevention | `capabilities/tenant/caps/register_tenant/workflow.py`, `capabilities/tenant/adapters/db/sql_store.py`, SQLAlchemy repositories | `test_security_sql_injection_org_name_treated_as_literal_and_db_intact` | PASS |
| Audit Logging section / `TC-SEC-TEN-REG-004` | Security event logging with IP/timestamp/tenant context | `capabilities/tenant/factory.py` (event writes), `capabilities/tenant/adapters/db/sql_store.py::log_security_event` | `test_security_audit_event_persisted_for_successful_registration` | PASS |
| Security (webhook integrity) | Webhook signature validation | `capabilities/tenant/adapters/keycloak/webhook_validator.py`, `verify_email_webhook` cap | `test_webhook_invalid_signature_rejected` | PASS |
| Security (webhook replay) | Replay detection & persistence | `capabilities/tenant/adapters/db/sql_store.py::record_webhook_receipt`, `verify_email_webhook` flow | `test_webhook_replay_event_id_rejected` + live runtime checks | PASS |
| Security / Privacy crossover | PII encryption-at-rest | `capabilities/tenant/adapters/db/encryption.py`, `core_identity_projection_repository.py` | `test_encrypt_text_produces_ciphertext_and_decrypts`, `test_security_pii_is_encrypted_at_rest_in_db` | PASS |
| OPA policy enforcement | Policy deny and fail-closed behavior | `capabilities/tenant/adapters/opa/policy_adapter.py`, `capabilities/tenant/factory.py` | `test_opa_adapter_fail_closed_when_remote_unreachable`, `test_register_flow_rejects_when_opa_denies`, `test_real_opa_adapter_decision` | PASS |
| SaaS web security (anti-framing) | Prevent iframe embedding of SaaS app | `ui-apps/service-gen-saas/next.config.mjs` (global headers) | `ui-apps/service-gen-saas/tests/e2e/security-headers.spec.ts` | PASS |

## 2. Control Ownership Notes
- Password hashing / password storage is a Keycloak (IdP) control, verified in Keycloak DB rather than tenant domain DB.
- CAPTCHA presence is currently validated at tenant API request level; stronger provider-side verification hardening remains part of broader enterprise backlog.
