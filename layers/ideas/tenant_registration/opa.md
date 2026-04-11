📄 opa.md
Open Policy Agent (OPA) Architecture & Enforcement Model

Context: WF-TENANT-REG-001 (Tenant Registration with Keycloak)
Version: 1.0

1. Purpose

This document defines the architectural role, enforcement placement, governance integration, and operational model of Open Policy Agent (OPA) within the ServiceGen SaaS Factory platform, specifically for the tenant_registration workflow.

OPA functions as the Policy Decision Engine (PDE) across:

CI/CD validation

API authorization

Workflow state transition validation

Infrastructure admission control

Runtime compliance verification

OPA externalizes enforcement logic from application code and makes policy machine-verifiable.

2. OPA Role in the SaaS Factory

OPA does NOT:

Replace Keycloak (authentication)

Replace the Saga orchestrator

Replace business logic

OPA DOES:

Validate control injection

Enforce Zero Trust authorization

Validate workflow transitions

Enforce compliance mappings

Enforce risk mitigation presence

Block CI/CD if governance conditions fail

OPA becomes:

The enforcement layer for policy-as-code.

3. Enforcement Layers

OPA operates across four layers:

3.1 CI/CD Enforcement Layer

Purpose:
Prevent non-compliant workflow definitions from being deployed.

Validated Elements:

Required injection points exist

mTLS enforced for Keycloak & webhooks

Event signing defined

Idempotency defined

Rollback strategies defined

Compliance mappings present

Risk mappings complete

Test coverage references present

Deterministic state machine enforced

Shared-realm identity strategy enforced

Failure Behavior:
Pipeline fails immediately.

Tooling:

conftest

opa eval

3.2 API Gateway Authorization Layer

OPA evaluates:

Can this identity perform tenant.register?

Is rate limit exceeded?

Is IP blacklisted?

Is tenant claim valid?

Is MFA required?

Input:

Keycloak-issued JWT

Request metadata

Risk score context

Output:

Allow / Deny decision

3.3 Workflow Orchestrator Validation Layer

OPA validates:

Is transition from state A → B allowed?

Is consent present before identity provisioning?

Is Keycloak provisioning allowed?

Is rollback required?

Is risk threshold exceeded?

This prevents invalid state transitions.

3.4 Infrastructure / Admission Control Layer

OPA (Gatekeeper or admission controller) validates:

mTLS required in service config

Webhook signature validation enabled

Secrets not hardcoded

Service accounts properly scoped

Network policies enforced

4. Integration with Keycloak

Keycloak handles:

Authentication

Credential storage

MFA

Token issuance

OPA handles:

Authorization decisions

Policy enforcement

State validation

Compliance enforcement

JWT validation flow:

API Gateway verifies Keycloak token signature.

Claims extracted.

OPA evaluates policy using:

tenant_id

roles

mfa claim

request context

5. Policy Domains

OPA policies are grouped by domain:

injection (control presence validation)

identity (shared realm enforcement)

mtls (secure communication enforcement)

event (signed envelope validation)

idempotency (duplicate prevention enforcement)

rollback (failure strategy enforcement)

compliance (SOC2 / ISO / PIPEDA mapping validation)

risk (risk mitigation coverage)

tests (test coverage completeness)

state_machine (deterministic enforcement)

6. Governance & Risk Integration

OPA decisions produce:

Policy decision logs

Audit artifacts

Evidence records

Each deny event can:

Increase risk score

Trigger governance alert

Block deployment

Generate compliance artifact

OPA becomes part of:

Continuous Compliance

Continuous Risk Scoring

Zero Trust Enforcement

7. CI/CD Integration Model

Example:

conftest test workflow.yml --policy ./policy/

If deny rules triggered:

Deployment blocked

Governance notified

Risk register updated (if configured)

OPA ensures:

No workflow can be deployed unless fully compliant.

8. Runtime Evaluation Flow

User → API Gateway → JWT validated
→ OPA authorization decision
→ Workflow Orchestrator
→ OPA state validation
→ Keycloak provisioning
→ Webhook → OPA validation
→ Governance registration

OPA is invoked:

Before critical transitions

Before external identity provisioning

Before activation

9. Compliance Mapping Enforcement

OPA validates that workflow.yml contains:

SOC2:

CC1

CC6

CC7

CC9

ISO 27701:

A.7.2.1

A.7.2.4

A.7.2.8

B.8.2.1

PIPEDA:

Consent

Safeguards

Accountability

Without mapping → deny.

10. Benefits

With OPA:

Compliance becomes executable.

Risk becomes enforceable.

Control injection becomes mandatory.

Identity misuse becomes restricted.

Drift becomes detectable.

Governance becomes automated.

OPA transforms:

Policy → Code → Enforcement → Evidence.