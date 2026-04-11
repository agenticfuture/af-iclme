# Tenant Registration Privacy Specification
Version: 1.0
Derived From: Privacy System Spec v1.0, PIPEDA
Status: Draft

---

# 1. Privacy Principles Enforcement

## PRV-TEN-REG-001: Consent Management
**Requirement**: During registration, the system must capture explicit consent for the Privacy Policy and Terms of Service.
**Implementation**:
- Checkbox must be unselected by default.
- Verification link sent via email serves as a secondary confirmation of intent.
- Record stored in `consent_ledger`.

## PRV-TEN-REG-002: Data Minimization
**Requirement**: Only collect fields necessary for account creation.
**Implementation**:
- Fields: Organization Name, Admin Email, Password.
- Avoid collecting PII not required for authentication or multitenancy.

## PRV-TEN-REG-003: Tenant Isolation (Privacy)
**Requirement**: Registration must ensure the `tenant_id` is unique and assigned correctly to the admin user to prevent cross-tenant data leakage from the start.

---

# 2. Deletion and Retention
Registration data is subject to the `retention_engine`.
- If email is not verified within 48 hours, the 'Draft' tenant account is automatically purged.
