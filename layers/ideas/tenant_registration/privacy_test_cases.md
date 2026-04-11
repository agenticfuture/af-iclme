# Tenant Registration Privacy Test Cases
Version: 1.0
Derived From: Privacy Spec v1.0, Privacy Test Cases v1.0

---

## TC-PRV-TEN-REG-001: Consent Record Persistence
**Requirement**: PRV-TEN-REG-001
**Steps**:
1. Complete registration.
2. Inspect `consent_ledger`.
**Expected Result**:
- A row exists for the new user.
- `consent_type` = 'service'.
- `status` = 'granted'.
- `granted_at` timestamp is accurate.

---

## TC-PRV-TEN-REG-002: Data Minimization Audit
**Requirement**: PRV-TEN-REG-002
**Steps**:
1. Inspect the database schema for the registration endpoint.
**Expected Result**:
- No fields for PII such as "Home Address" or "Phone Number" are required or collected during initial registration.

---

## TC-PRV-TEN-REG-003: Tenant Isolation Verification
**Requirement**: PRV-TEN-REG-003
**Steps**:
1. Register two different tenants (Tenant A and Tenant B).
2. Attempt to login as Admin A and query any data.
**Expected Result**:
- Query response contains exclusively data from Tenant A's realm.
- No Tenant B metadata is leaked during the registration/login handshake.
