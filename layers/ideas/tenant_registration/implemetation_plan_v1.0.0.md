# Tenant Registration Implementation Plan v1.0.0

Status: Chat-only blueprint captured to file (no code changes applied)
Scope: `tenant_registration` domain implementation blueprint aligned to `workflow_v0.8.1` + Keycloak + OPA + domain-owned DB adapter + domain-first CI/CD + cloud readiness

## 1. Target Outcome (What This Blueprint Delivers)
1. `tenant` domain becomes the owner of tenant registration workflow and tenant/user/org creation orchestration.
2. `tenant` domain has:
   - object-based factory (`TenantDomain`)
   - cross-domain facade (`TenantDomainAPI`)
   - its own DB adapter, schema, models, migrations
   - Keycloak adapter
   - OPA adapter
   - logging/error handling defaults
   - deterministic saga workflow (`workflow_v0.8.1`)
   - domain-first CI/CD generation assets
3. Main repo imports tenant CI/CD from normal `.github` workflows.

## 2. Core Design Decisions (Final)
1. `TenantDomain` is an object, not only a mount function.
2. `tenant_domain_api` is the external cross-domain communication door.
3. `tenant` domain owns tenant registration and tenant/user/org creation handling.
4. `tenant` domain has its own DB adapter + migrations and can copy the shared core model structure for the tables it owns/uses in this refactor.
5. `Keycloak` remains IdP (credentials, email verification, MFA, tokens).
6. `OPA` is the policy decision engine.
7. `Prefect` remains workflow orchestrator (traceability preserved).
8. Logging and error handling are built-in defaults at domain and adapter boundaries.

## 3. Final Responsibility Split
1. `Tenant Domain (ServiceGen)` owns:
   - public registration workflow
   - tenant/org/user internal projection
   - consent ledger
   - registration workflow state
   - OPA decisions + evidence
   - audit/security events
   - idempotency/replay protection
   - rollback and purge
   - signed domain events
2. `Keycloak` owns:
   - credentials + password hashing policy
   - email verification execution
   - MFA policy execution
   - OIDC tokens
   - user/group/role primitives
3. `OPA` owns:
   - policy decisions (allow/deny/select policy set)
   - policy logic versioning (bundle/revision)
4. `Main Platform` owns:
   - integration orchestration between domains
   - repo-wide CI/CD
   - deployment composition
   - environment provisioning

## 4. Domain Package Blueprint (Tenant)
Proposed structure (chat-only blueprint):
1. `capabilities/tenant/__init__.py`
2. `capabilities/tenant/factory.py`
3. `capabilities/tenant/contracts/`
4. `capabilities/tenant/contracts/entities.py`
5. `capabilities/tenant/contracts/errors.py`
6. `capabilities/tenant/contracts/events.py`
7. `capabilities/tenant/caps/register_tenant/`
8. `capabilities/tenant/caps/verify_email_webhook/`
9. `capabilities/tenant/caps/resend_verification/`
10. `capabilities/tenant/caps/purge_unverified/`
11. `capabilities/tenant/caps/get_registration_status/`
12. `capabilities/tenant/shared/`
13. `capabilities/tenant/shared/logging.py`
14. `capabilities/tenant/shared/correlation.py`
15. `capabilities/tenant/shared/idempotency.py`
16. `capabilities/tenant/shared/state_machine.py`
17. `capabilities/tenant/shared/event_signing.py`
18. `capabilities/tenant/adapters/db/`
19. `capabilities/tenant/adapters/keycloak/`
20. `capabilities/tenant/adapters/opa/`
21. `capabilities/tenant/adapters/email/` (optional)
22. `capabilities/tenant/tests/`
23. `capabilities/tenant/ci/` (domain CI generation assets)
24. `capabilities/tenant/policies/` (OPA rego + test data)

## 5. Factory Contract (HTTP + Cross-Domain Communication Door)
`factory.py` should expose both:
1. `mount_tenant_domain(app)` for HTTP routes
2. `tenant_domain_api` object (cross-domain callable facade)

### 5.1 `TenantDomainAPI` methods (suggested)
1. `register_tenant(...)`
2. `handle_keycloak_email_verified(event, context)`
3. `resend_verification(...)`
4. `get_registration_status(...)`
5. `purge_expired_pending_registrations(...)`
6. `activate_tenant_if_eligible(...)`
7. `get_tenant_identity_context(...)` (optional)
8. `get_tenant_policy_context(...)` (optional)

Rules:
1. Other domains use this facade, not internal cap imports.
2. Facade returns typed domain contracts and raises typed domain errors.
3. Facade logs correlation IDs and wraps adapter errors.

## 6. Workflow v0.8.1 State Machine (Final)
Implement exactly (persisted state transitions):
1. `START`
2. `RegistrationRequested`
3. `APIValidated`
4. `RateLimitValidated`
5. `BotProtectionValidated`
6. `ConsentValidated`
7. `TenantPersisted`
8. `KeycloakGroupProvisioned`
9. `KeycloakUserProvisioned`
10. `EmailVerificationPending`
11. `EmailVerified`
12. `PoliciesBound`
13. `GovernanceRegistered`
14. `AuditLogged`
15. `TenantActivated`
16. `END`

Failure states:
1. `ValidationFailed`
2. `DuplicateRejected`
3. `KeycloakProvisionFailed`
4. `ConsentFailed`
5. `EmailVerificationTimeout`
6. `RollbackCompleted`

Enforcement:
1. Explicit transition validator (table-driven)
2. Sequence number enforcement
3. Correlation ID bound to saga instance
4. Out-of-order transitions rejected and logged as security events

## 7. Tenant Domain-Owned DB Adapter (Schema + Migrations)
Keep current shared DB untouched. Add tenant-owned schema/migrations in adapter.

Suggested tenant-owned schemas/tables:
1. `tenant_reg.registration_requests`
2. `tenant_reg.registration_state_transitions`
3. `tenant_reg.idempotency_keys`
4. `tenant_reg.webhook_receipts`
5. `tenant_reg.consent_ledger`
6. `tenant_reg.policy_decisions`
7. `tenant_sec.registration_security_events`
8. `tenant_gov.registration_governance_entries`
9. `tenant_evt.outbox_events`
10. `tenant_reg.reconciliation_runs` (optional advanced)

### 7.1 Core Table Definitions (Conceptual)
1. `tenant_reg.registration_requests`
   - `id`, `correlation_id`, `idempotency_key`, `email_hash`, `email_domain`
   - `org_name`, `tenant_id`, `org_id`, `core_user_id`
   - `keycloak_user_id`, `keycloak_group_path`
   - `status`, `current_state`, `expires_at`
   - `last_error_code`, `last_error_message_redacted`
   - `region/jurisdiction`, `created_at`, `updated_at`
2. `tenant_reg.registration_state_transitions`
   - `id`, `registration_id`, `from_state`, `to_state`, `sequence_number`, `performed_at`, `decision_ref`, `actor`, `metadata`
3. `tenant_reg.idempotency_keys`
   - `key`, `request_fingerprint`, `registration_id`, `status`, `safe_resume_state`, `expires_at`
4. `tenant_reg.webhook_receipts`
   - `event_id`, `source`, `issuer`, `signature_valid`, `correlation_id`, `registration_id`, `received_at`, `processed_at`, `replay_detected`
5. `tenant_reg.consent_ledger`
   - `id`, `registration_id`, `tenant_id`, `subject_email_hash`, `consent_type`, `consent_version`, `granted`, `purpose`, `jurisdiction`, `ip_hash/ip`, `user_agent_hash`, `evidence_hash`, `granted_at`
6. `tenant_reg.policy_decisions`
   - `id`, `registration_id`, `decision_point`, `policy_package`, `policy_rule`, `bundle_revision`, `input_fingerprint`, `decision`, `explanation`, `decided_at`
7. `tenant_sec.registration_security_events`
   - `id`, `registration_id`, `event_type`, `severity`, `ip`, `ua`, `result`, `reason`, `correlation_id`, `created_at`
8. `tenant_gov.registration_governance_entries`
   - `registration_id`, `risk_registry_entry`, `compliance_registry_entry`, `audit_registry_entry`, `status`, `registered_at`
9. `tenant_evt.outbox_events`
   - `id`, `event_type`, `aggregate_id`, `correlation_id`, `sequence_number`, `payload`, `signature`, `status`, `published_at`, `retry_count`

### 7.2 Migrations Strategy
1. Domain migration tooling lives in `tenant/adapters/db/migrations`.
2. Migration naming/versioning are domain-local.
3. Domain CI validates forward migration and rollback safety.
4. Cloud deployment runs tenant migrations before app rollout.

## 8. Keycloak Integration (Advanced, Enterprise-Ready)
### 8.1 Keycloak Model
1. Shared realm + tenant group model (`tenant_{tenant_id}`).
2. Client: `service-gen-saas` (OIDC).
3. Required claims validated by ServiceGen: `sub`, `email`, `tenant_id`, `roles`, `exp`, `iss` (+ audience).
4. Signature verification via JWKS.

### 8.2 Keycloak Adapter Capabilities
1. `create_tenant_group(tenant_id)`
2. `assign_default_roles_to_group(...)`
3. `create_admin_user(email, name, group, requiredActions)`
4. `trigger_verify_email(user_id)`
5. `enforce_mfa_policy_for_group_or_role(...)`
6. `get_user_by_email(...)`
7. `get_user(user_id)`
8. `delete_user(user_id)` (compensation)
9. `delete_group(group_id)` (compensation)
10. `validate_group_membership(user_id, tenant_group)`

### 8.3 Security Requirements for Keycloak Admin API
1. mTLS required.
2. Least-privileged service account.
3. Short-lived access token caching.
4. Bounded retries for safe operations.
5. Idempotency checks before create calls.
6. Redacted logs.

### 8.4 Email Verification Completion Path
Preferred:
1. Webhook/event receiver from Keycloak (or equivalent event bridge).
2. Validate mTLS/HMAC/issuer/realm/correlation/group membership.
3. Transition `EmailVerificationPending -> EmailVerified`.
4. Continue saga to activation.

Fallback:
1. Activation-sync endpoint on auth callback queries Keycloak `emailVerified`.
2. Preserve same validation/evidence semantics.

## 9. OPA Integration (Policy Decision Layer)
### 9.1 Decision Points
1. `api_boundary.registration_request_allowed`
2. `consent.required_consent_matrix`
3. `pre_persistence.data_handling_policy`
4. `keycloak.role_binding_policy`
5. `activation.tenant_activation_gate`
6. `governance.registration_completeness_gate`

### 9.2 OPA Adapter
1. `evaluate(decision_point, input, context) -> decision`
2. Captures `bundle_revision`, package/rule, decision/explanation, input fingerprint.
3. Fail-closed for critical decisions.
4. Optional short-lived cache for static decisions.

### 9.3 OPA Policy Bundle Governance
1. Domain-owned Rego under `capabilities/tenant/policies`.
2. Policy tests with fixtures.
3. Bundle version pinned in deployment.
4. CI validates decision-point coverage.

## 10. Public API and Internal Contracts (Tenant Domain)
### 10.1 HTTP Endpoints
1. `POST /api/tenant/v1/register`
2. `POST /api/tenant/v1/resend-verification`
3. `POST /api/tenant/v1/verify-email-webhook`
4. `GET /api/tenant/v1/registrations/{id}`
5. `POST /api/tenant/v1/internal/purge-unverified`
6. `POST /api/tenant/v1/internal/reconcile-keycloak` (advanced)

### 10.2 Register Request Contract (Minimum)
1. `organization_name`
2. `admin_email`
3. `captcha_token`
4. `consent` (`terms_version`, `privacy_version`, `accepted`)
5. `client_context` (locale/timezone/jurisdiction optional)
6. `idempotency_key` (header preferred)
7. `correlation_id` (header accepted or generated)

Notes:
1. Prefer Keycloak-hosted credential entry to avoid password handling in ServiceGen registration API.
2. If password passes through ServiceGen, ServiceGen must treat it as transient and hand off to Keycloak only.

## 11. Logging and Error Handling Standards (Default)
### 11.1 Logging
Every entrypoint logs:
1. `correlation_id`
2. `registration_id` (when available)
3. `idempotency_key_hash`
4. `decision_point`
5. `state`
6. `actor/source`
7. `result`
8. latency

Never log:
1. raw passwords
2. raw tokens
3. admin tokens/secrets
4. full emails (only hash/masked)

### 11.2 Error Handling
1. Typed domain errors mapped to standardized API responses.
2. Adapter errors wrapped with retryability metadata.
3. Rollback errors preserved as evidence.
4. User-facing errors sanitized.
5. Security validation failures create security events.

### 11.3 API Error Response Schema
1. `error_code`
2. `message` (safe)
3. `correlation_id`
4. `retryable`
5. `next_action` (optional)
6. `details` (non-sensitive)

## 12. Security Controls (Mapped to Specs + v0.8.1)
1. CAPTCHA validation at API boundary.
2. Rate limiting (5 attempts/IP/hour).
3. SQL injection prevention (validation + SQLAlchemy).
4. Security event logging for all attempts.
5. JWT verification (JWKS signature/aud/iss/exp).
6. Webhook validation (mTLS + HMAC + issuer/realm/group/correlation).
7. Signed event emission (Ed25519/RSA256).
8. Replay protection for webhooks and events.
9. Least-privilege Keycloak admin service account.
10. Secret rotation support.
11. Tenant isolation guards before/after persistence.
12. Deferred resource allocation until `TenantActivated`.

## 13. Privacy Controls (Mapped to Specs)
1. Consent ledger persistence with versioned evidence.
2. Data minimization.
3. Tenant isolation initialization before downstream provisioning.
4. 48h purge for unverified registrations.
5. PII classification/tagging at pre-persistence injection point.
6. Encryption-at-rest enforcement evidence.
7. Immutable evidence/hash-chain reference (advanced).

## 14. Risk Controls (Mapped to Specs + v0.8.1)
1. Bot abuse mitigation:
   - captcha
   - rate limiting
   - idempotency
   - deferred allocation
2. Unauthorized activation mitigation:
   - Keycloak email verification
   - webhook validation
   - replay protection
   - timeout cleanup
3. Provisioning failure mitigation:
   - compensating rollback
   - reconciliation job
4. Drift risk mitigation:
   - periodic Keycloak/DB projection reconciliation

## 15. Saga, Idempotency, Rollback, Replay (Enterprise Grade)
### 15.1 Idempotency
1. `key_strategy`: hash(email + time_bucket) + request fingerprint.
2. Duplicate behavior:
   - completed -> reject
   - safe state -> resume
   - conflicting state -> reject + security event
3. TTL + cleanup for idempotency rows.

### 15.2 Rollback
On `KeycloakProvisionFailed`:
1. delete Keycloak user if created
2. delete Keycloak group if created and unbound
3. delete tenant projection records
4. log failure + emit signed `TenantRegistrationFailed`
5. update risk/governance evidence

On `EmailVerificationTimeout`:
1. delete/disable Keycloak user
2. delete tenant projection
3. mark saga timeout
4. log + audit + risk update

### 15.3 Replay Protection
1. `webhook_receipts` unique source event ID.
2. event sequence numbers for domain events.
3. correlation binding required.
4. replay rejections logged as security events.

## 16. Outbox/Inbox Pattern (Recommended Advanced)
1. Use `tenant_evt.outbox_events` for signed events.
2. Publisher worker sends asynchronously.
3. Consumers use inbox + dedupe.
4. Prevent dual-write inconsistencies and improve cloud reliability.

## 17. Domain-Owned CI/CD Generation (First-Class Deliverable)
### 17.1 Tenant Domain CI/CD Assets (in `capabilities/tenant/ci/`)
1. Workflow templates.
2. Scripts:
   - workflow spec conformance
   - traceability validation
   - OPA coverage validation
   - migration smoke tests
   - factory contract validation
   - evidence pack generation
3. Metadata manifests (required secrets/services/specs)

### 17.2 Required Domain Pipeline Stages
1. Static checks (lint/format/import boundaries)
2. Type/schema checks
3. DB adapter migration checks
4. Workflow spec conformance (`workflow_v0.8.1`)
5. OPA policy validation/tests
6. Keycloak contract tests (mock + optional integration)
7. Unit/integration tests
8. Traceability validation
9. Security checks (deps/secrets/fail-closed checks)
10. Evidence pack generation

### 17.3 Main Repo `.github` Import/Composition
1. Main workflows call tenant domain reusable workflow(s).
2. Aggregate across domains.
3. Platform integration pipeline runs after domain pipelines.
4. CD gates on domain CI pass + evidence presence.

## 18. Cloud Deployment Readiness (Must-Have)
### 18.1 Runtime Topology
1. Tenant domain API service
2. Tenant worker(s): purge/outbox/reconciliation
3. Postgres (managed preferred)
4. Keycloak (HA or managed-equivalent pattern)
5. OPA service/sidecar + bundle source
6. Message bus (recommended)
7. Secret manager
8. Observability stack

### 18.2 Kubernetes/Cloud Concerns
1. Migration job per domain before rollout
2. Health/readiness dependency posture
3. HPA
4. PDBs
5. NetworkPolicies
6. mTLS for Keycloak admin/webhook paths
7. cert and secret rotation
8. rollout strategy (canary/blue-green)

### 18.3 Config/Secrets (refs only)
1. `TENANT_DB_URL`
2. `KEYCLOAK_ADMIN_URL`
3. `KEYCLOAK_REALM`
4. `KEYCLOAK_CLIENT_ID`
5. `KEYCLOAK_CLIENT_SECRET` or mTLS refs
6. `OPA_URL`
7. `OPA_BUNDLE_REVISION_EXPECTED`
8. `CAPTCHA_PROVIDER_SECRET`
9. `EVENT_SIGNING_KEY_REF`
10. `WEBHOOK_HMAC_SECRET_REF`
11. `WEBHOOK_CLIENT_CA_REF`
12. `PURGE_UNVERIFIED_CRON`
13. `REGISTRATION_TTL_HOURS=48`

## 19. Observability and Operations (Enterprise+)
### 19.1 Metrics
1. registration total/success/failure
2. rate-limit rejects
3. captcha fails
4. OPA denies/errors
5. Keycloak provisioning latency/failures
6. webhook validation failures/replays
7. rollback counts
8. pending verification age distribution
9. verification completion time
10. purge cleanup count
11. reconciliation drift count

### 19.2 Tracing
1. Correlation ID propagated end-to-end.
2. Spans for API boundary, OPA, DB tx, Keycloak, webhook, event signing/emission.

### 19.3 Alerts
1. registration failure spikes
2. Keycloak provisioning failure threshold
3. webhook validation/replay spikes
4. OPA unavailable
5. purge job failure
6. reconciliation drift threshold
7. outbox backlog stuck

### 19.4 Runbooks (Required)
1. Keycloak outage
2. OPA outage (fail-closed)
3. webhook signature mismatch incident
4. stuck pending registrations
5. migration rollback
6. signing key rotation
7. reconciliation remediation

## 20. Testing Strategy (Comprehensive, Mapped to Specs)
### 20.1 Test Layers
1. Unit tests (state machine/idempotency/error mapping/adapters)
2. Integration tests (DB + workflow)
3. Contract tests (HTTP + facade)
4. Security tests (rate limit/SQLi/webhook/JWT)
5. Privacy tests (consent/minimization/purge)
6. Risk tests (bot abuse/timeout cleanup)
7. Workflow conformance tests
8. CI traceability tests
9. Cloud smoke tests (sandbox Keycloak realm)

### 20.2 Key Test Cases (from docs)
1. `TC-TEN-REG-001..004`
2. `TC-PRV-TEN-REG-001..003`
3. `TC-SEC-TEN-REG-001..004`
4. `TC-RISK-TEN-REG-001..002`

Plus v0.8.1-specific:
1. Keycloak mTLS config check
2. webhook signature validation enabled
3. injection-point presence
4. idempotency resume path
5. rollback compensation path
6. signed event envelope validation

## 21. Traceability Matrix Model (Enterprise Evidence Format)
Generated matrix columns:
1. `Spec ID`
2. `Spec Type`
3. `Control Owner` (`Tenant Domain` / `Keycloak` / `OPA` / `Infra`)
4. `Implementation Artifact`
5. `Test IDs`
6. `Evidence Artifact`
7. `Runtime Metric/Alert`
8. `Residual Risk`
9. `Status`

## 22. SaaS App Refactor Plan (Aligned to Tenant Domain)
1. Public register page submits to tenant domain API.
2. Show pending verification page with registration reference.
3. Resend verification calls tenant domain endpoint.
4. Auth callback performs activation sync if webhook not yet applied.
5. Handle duplicate/rate-limit/captcha/policy denied/timeout/already-active states.
6. Keep URLs/envs centralized and environment-driven.

## 23. Enterprise-Ready Gaps Checklist (Must Include Before “Done”)
1. ADRs
2. Threat model doc (User/API/OPA/Keycloak/Webhook trust boundaries)
3. Data classification matrix
4. Secret rotation plan + runbook
5. Key management plan for signing keys
6. Migration governance policy
7. Reconciliation job spec
8. Outbox/inbox reliability spec
9. SLOs + alerts
10. Incident runbooks
11. Compliance evidence pack generation
12. Domain API versioning policy
13. Webhook contract versioning + replay window policy
14. DR/backup restore validation for tenant domain DB schema

## 24. Implementation Sequence (Pragmatic but Enterprise-Grade)
1. Define contracts + constants + error taxonomy + logging conventions.
2. Build object-based factory (`TenantDomain`, `TenantDomainAPI`).
3. Build tenant DB adapter skeleton + migrations framework.
4. Add tenant-owned/refactored copies of tenant/org/user/user_pii models.
5. Add registration/evidence/outbox models + migrations.
6. Build repositories (projection + registration + consent + security + policy + governance + outbox).
7. Build Keycloak adapter (group/user/verify/resend/delete + validators).
8. Build OPA adapter + Rego policies + policy tests.
9. Implement state machine + idempotency + replay protection.
10. Implement `register_tenant` cap/workflow with rollback + resume.
11. Implement webhook receiver + resend + status + purge caps.
12. Implement signed outbox event emission/publisher.
13. Add tenant domain tests (unit/integration/security/privacy/risk/contracts/architecture).
14. Add domain CI generation assets + validators + evidence pack generator.
15. Integrate tenant domain CI into main `.github`.
16. Refactor SaaS onboarding to tenant domain + Keycloak flow.
17. Add cloud ops artifacts (runbooks/SLOs/alerts) and deployment env refs.

## 25. Final Enterprise-Ready Completeness Checklist
1. `TenantDomain` object exists
2. `tenant_domain_api` facade exists and is used cross-domain
3. Domain-owned DB adapter + migrations exist
4. Tenant/org/user/user_pii creation handled by tenant domain repositories
5. Keycloak adapter with mTLS + least privilege exists
6. OPA adapter + policy packages + tests exist
7. Workflow v0.8.1 conformance validator exists
8. Idempotency resume + rollback compensation implemented
9. Webhook replay protection implemented
10. Signed outbox event pattern implemented
11. Logging/error handling defaults enforced
12. Traceability matrix generation implemented
13. Domain CI generated and imported by main repo `.github`
14. SaaS onboarding refactored off Auth0 placeholders
15. Cloud readiness (secrets/alerts/runbooks/SLOs) defined

## 26. Canonical Naming (Final)
1. Domain object: `TenantDomain`
2. Cross-domain facade class: `TenantDomainAPI`
3. Exported facade instance: `tenant_domain_api`
4. Exported domain object instance: `tenant_domain`
5. Mount helper: `mount_tenant_domain`
6. Core projection repository: `CoreIdentityProjectionRepository`
7. Registration repo: `TenantRegistrationRepository`
8. Policy adapter: `OpaPolicyDecisionAdapter`
9. Keycloak adapter: `KeycloakTenantIdentityAdapter`
10. Webhook validator: `KeycloakWebhookValidator`
11. Schemas: `tenant_reg`, `tenant_sec`, `tenant_gov`, `tenant_evt`

## 27. Notes
1. This file captures the blueprint only. No code or migrations were generated/applied.
2. The plan assumes `workflow_v0.8.1` is the controlling workflow specification for implementation.
3. The tenant domain will own and handle tenant/user/org generation through its own adapter and repositories, including copied/refactored model structures where required by the refactor.
