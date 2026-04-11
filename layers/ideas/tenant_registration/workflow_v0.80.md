# Tenant Registration – Deterministic Workflow Definition
IDEA: tenant_registration
Requirement: BR-TEN-001
Change: CHG-TR-0002
Version: 0.1

---

# 1. Purpose

This workflow defines the full deterministic orchestration of tenant_registration,
ensuring:

- Full compliance with requirements_spec
- Full privacy enforcement
- Full security enforcement
- Full risk mitigation
- Passing all defined test cases
- Deterministic state transitions
- Signed event emission
- Policy-injected execution
- Replay protection & idempotency

---

# 2. Workflow Type

Pattern: Saga Orchestrator (Centralized Control)
Workflow ID: WF-TENANT-REG-001

---

# 3. State Machine Definition

START
  → RegistrationRequested
  → InputValidated
  → RateLimitValidated
  → BotProtectionValidated
  → ConsentValidated
  → TenantPersisted
  → AdminUserPersisted
  → PoliciesBound
  → GovernanceRegistered
  → AuditLogged
  → EventEmitted
  → PendingEmailVerification
END

Failure States:
  → ValidationFailed
  → ConsentFailed
  → RateLimitExceeded
  → DuplicateEmailRejected
  → PersistenceFailed

State transitions are strict and sequential.
Out-of-order transitions rejected.

---

# 4. Injection Points

## API Boundary (Step 1)

Injected Controls:
- Request schema validation
- Rate limiting
- CAPTCHA/bot detection
- Correlation ID generation
- Telemetry start
- Idempotency key generation

Test Coverage:
- TC-TR-SEC-003
- TC-TR-RISK-001

Risk Mitigation:
- RISK-SEC-TR-001

Compliance:
- SOC2 CC6
- ISO 27701 A.7.2.8

---

## Pre-Persistence (Step 5)

Injected Controls:
- Consent ledger write
- Data classification tagging
- PII tagging
- Tenant isolation guard
- Encryption-at-rest enforcement

Test Coverage:
- TC-TR-PRIV-001
- TC-TR-PRIV-002

Risk Mitigation:
- RISK-PRIV-TR-002
- RISK-REG-TR-004

Compliance:
- PIPEDA Consent
- ISO 27701 A.7.2.1

---

## Persistence Layer (Step 6–7)

Actions:
- Generate tenant_id (UUID v4)
- Persist tenant
- Hash password (Argon2)
- Persist admin user

Test Coverage:
- TC-TR-REQ-001
- TC-TR-SEC-001

Compliance:
- SOC2 CC6

---

## Policy Binding (Step 8)

Actions:
- Bind default RBAC
- Bind retention policy
- Bind AI policy
- Register compliance metadata

Test Coverage:
- TC-TR-REQ-001

Risk Mitigation:
- RISK-REG-TR-004

---

## Governance Registration (Step 9)

Actions:
- Register tenant in Risk Registry
- Register tenant in Compliance Registry
- Register tenant in Audit Registry

Compliance:
- ISO 27701 PIMS
- SOC2 CC1

---

## Post-State Injection (Step 10)

Actions:
- Audit log (TenantCreated)
- Risk scoring update
- Evidence capture

Test Coverage:
- TC-TR-REQ-001
- TC-TR-RISK-002

---

## Event Emission (Step 11)

Event Name: TenantRegistered

Envelope:

{
  event_id,
  event_type: TenantRegistered,
  source_service: tenant-service,
  workflow_id: WF-TENANT-REG-001,
  tenant_id,
  correlation_id,
  sequence_number: 1,
  timestamp,
  signature,
  payload
}

Controls:
- Signed using service private key
- Idempotency enforced
- Replay protected

Test Coverage:
- TC-TR-SEC-002

---

# 5. Idempotency Rules

- Idempotency key = hash(email + timestamp bucket)
- Duplicate key → reject execution
- Prevent duplicate tenant creation

---

# 6. Deterministic Ordering

Ordering enforced by:
- Saga orchestrator
- Explicit state validation
- Sequence number
- Correlation ID binding

Any invalid state transition → reject.

---

# 7. Failure Handling

On failure:
- Rollback partial tenant
- Log failure
- Emit TenantRegistrationFailed event (signed)
- Update risk engine

---

# 8. Traceability Matrix

| Step | Requirement | Privacy | Security | Risk | Test |
|------|------------|---------|----------|------|------|
| API Boundary | FR-TR-001 | | SEC-SYS-007 | RISK-SEC-TR-001 | TC-TR-SEC-003 |
| Consent | FR-TR-005 | Consent Ledger | | RISK-REG-TR-004 | TC-TR-PRIV-001 |
| Persistence | FR-TR-001 | | Argon2 | | TC-TR-SEC-001 |
| Policy Bind | FR-TR-005 | Retention | RBAC | | TC-TR-REQ-001 |
| Event Emit | FR-TR-006 | | Signed Event | | TC-TR-SEC-002 |

---

# 9. Compliance Mapping

SOC2:
- CC1 Governance
- CC6 Logical Access
- CC7 Integrity

ISO 27701:
- A.7.2.1 Consent
- A.7.2.4 Retention
- B.8.2.1 Processor Obligations

PIPEDA:
- Consent
- Safeguards
- Accountability

---

# End of Workflow Definition