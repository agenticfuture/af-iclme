workflow.md

Tenant Registration – Deterministic Saga Workflow with Keycloak Integration

IDEA: tenant_registration
Requirement: BR-TEN-001
Workflow ID: WF-TENANT-REG-001
Version: 0.2 (Keycloak Integrated)

1. Purpose

This document defines the deterministic, enterprise-grade tenant_registration workflow with Keycloak as the Identity Provider (IdP).

This workflow:

Replaces internal identity handling with Keycloak

Preserves deterministic Saga orchestration

Ensures ordering and replay protection

Enforces control injection at defined boundaries

Guarantees cross-layer compliance (Privacy, Security, Risk)

Passes all functional, privacy, security, and risk test cases

2. Architectural Positioning
2.1 Trust Boundaries
[User]
   ↓
[API Gateway]
   ↓
[Workflow Orchestrator]
   ↓
[Keycloak]  ← Identity Trust Boundary
   ↓
[ServiceGen Core Services]

Keycloak is treated as:

External Identity Authority

Credential Store

Token Issuer

MFA Engine

Email Verification Engine

ServiceGen retains authority over:

Tenant lifecycle

Governance registration

Risk scoring

Policy binding

Compliance enforcement

3. Identity Strategy
3.1 Realm Strategy

Shared Realm + Tenant Group Model

All users reside in a single realm.

Each tenant has a Keycloak Group:

group: tenant_{tenant_id}

Tokens include:

tenant_id claim
roles
group membership

Tenant isolation enforced at API Gateway and service layer.

4. Deterministic Saga State Machine

START
→ RegistrationRequested
→ APIValidated
→ RateLimitValidated
→ BotProtectionValidated
→ ConsentValidated
→ TenantPersisted
→ KeycloakGroupProvisioned
→ KeycloakUserProvisioned
→ EmailVerificationPending
→ EmailVerified (Webhook)
→ PoliciesBound
→ GovernanceRegistered
→ AuditLogged
→ TenantActivated
END

Failure States:

ValidationFailed

DuplicateRejected

KeycloakProvisionFailed

ConsentFailed

EmailVerificationTimeout

RollbackCompleted

State transitions are strictly enforced.
Out-of-order transitions are rejected.

5. Detailed Workflow Steps
Step 1 — API Boundary Injection

Injected Controls:

Request schema validation

Rate limiting

CAPTCHA / bot detection

Correlation ID generation

Idempotency key creation

Telemetry start

Risk Mitigated:

RISK-SEC-TR-001 (abuse)

RISK-AI-TR-003 (automation attack)

Test Coverage:

TC-TR-SEC-003

TC-TR-RISK-001

Compliance:

SOC2 CC6

ISO 27701 A.7.2.8

Step 2 — Consent Validation (Pre-Identity Provisioning)

Before creating identity in Keycloak:

Actions:

Store consent in Consent Ledger

Immutable hash chain update

Tag purpose = tenant_registration

Failure → Abort before identity creation.

Risk Mitigated:

RISK-REG-TR-004

Compliance:

PIPEDA Consent

ISO 27701 A.7.2.1

Test Coverage:

TC-TR-PRIV-001

Step 3 — Tenant Persisted (Internal DB)

Actions:

Generate UUID v4 tenant_id

Persist org metadata

Status = PROVISIONING

Enforce encryption-at-rest

Apply tenant isolation guard

Test Coverage:

TC-TR-REQ-001

Step 4 — Keycloak Group Provisioning

Using Keycloak Admin API (mTLS secured):

Action:

Create group: tenant_{tenant_id}

Attach default realm roles

Configure policy bindings

Enforce email verification required

Configure MFA required for tenant_admin role

Service Authentication:

mTLS

Service Account with minimal scope

Failure Handling:

If group exists → verify ownership (idempotency)

If failure → rollback tenant

Step 5 — Keycloak User Provisioning

Admin API Call:

POST /admin/realms/{realm}/users

Payload:

email

enabled=true

emailVerified=false

requiredActions=["VERIFY_EMAIL"]

group membership = tenant_{tenant_id}

Password Handling:

Keycloak handles Argon2 hashing internally

Idempotency:

Check if email already exists

If exists and bound to tenant group → resume

If exists in different group → reject

Test Coverage:

TC-TR-SEC-001

Step 6 — Email Verification Pending

Keycloak sends verification email.

Workflow transitions to:
EmailVerificationPending

TTL:

Configurable (e.g., 24 hours)

No activation allowed until verified.

Step 7 — Webhook Synchronization (Email Verified)

Keycloak triggers event via:

Webhook

Or polling event

Webhook Controls:

mTLS validation

HMAC signature validation

Verify issuer

Validate realm

Validate group membership

Validate correlation_id

If valid:
→ Transition to EmailVerified

Test Coverage:

TC-TR-SEC-002

Step 8 — Policies Bound

After email verification:

Bind RBAC policies

Bind retention policy

Bind AI governance policy

Bind compliance metadata

Ensures:

Default isolation

Default retention

Default risk scoring

Step 9 — Governance Registration

Actions:

Register tenant in Risk Registry

Register tenant in Compliance Registry

Register tenant in Audit Registry

Compliance:

SOC2 CC1

ISO 27701 PIMS

Step 10 — Audit Logging

Record:

TenantCreated

IdentityProvisioned

EmailVerified

TenantActivated

Immutable log.

Test Coverage:

TC-TR-REQ-001

Step 11 — Tenant Activated

Status updated:
ACTIVE

Event Emitted:
TenantRegistered

Event Envelope:

{
event_id,
event_type: TenantRegistered,
source_service: tenant-orchestrator,
workflow_id: WF-TENANT-REG-001,
tenant_id,
correlation_id,
sequence_number: 1,
timestamp,
signature
}

Signed using service private key.

Replay protected.

6. Token Lifecycle (Post Activation)

User Login Flow:

Redirect to Keycloak (OIDC).

Keycloak authenticates + MFA.

Issues signed JWT.

API Gateway:

Validates signature

Validates audience

Validates expiration

Extracts tenant_id claim

Enforces tenant isolation

No internal token generation.

7. Idempotency Strategy

Idempotency Key:
hash(email + time_bucket)

Stored in workflow store.

If duplicate:

Reject re-execution

Resume previous state if safe

Prevents:

Duplicate tenant

Duplicate identity

8. Failure & Rollback Strategy

If Keycloak user provisioning fails:

Delete Keycloak group (if created)

Delete tenant record

Log failure

Emit TenantRegistrationFailed event

Update risk engine

If email verification timeout:

Scheduled cleanup job

Delete Keycloak user

Delete tenant record

Log timeout

Update risk registry

9. Injection Points Summary
Injection Point	Controls
API Boundary	Rate limit, CAPTCHA, idempotency
Pre-Persistence	Consent ledger, PII tagging
Keycloak API Call	mTLS, scoped service account
Webhook Receiver	Signature validation, issuer validation
Post-State	Audit log, risk scoring
Event Emission	Signing, replay protection
10. Compliance Mapping

SOC2:

CC1 Governance

CC6 Logical Access (Keycloak)

CC7 Integrity

CC9 Risk Mitigation

ISO 27701:

A.7.2.1 Lawful basis

A.7.2.4 Retention

A.7.2.8 Security of PII

B.8.2.1 Processor instructions

PIPEDA:

Consent

Safeguards

Accountability

Limiting Use

11. Deterministic Guarantees

Ordering enforced via:

Central Saga Orchestrator

Explicit state validation

Sequence number enforcement

Correlation ID binding

Identity authenticity enforced via:

mTLS

Signed webhooks

JWT signature validation

Replay protection enforced via:

Idempotency keys

Event sequence validation

12. Final Result

This workflow:

Fully integrates Keycloak

Maintains deterministic ordering

Preserves all control injection

Enforces privacy & risk controls

Satisfies all test cases

Is governance-ready

Is CI/CD enforceable

Is policy-as-code compatible