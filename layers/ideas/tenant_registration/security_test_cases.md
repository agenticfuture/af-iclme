# Tenant Registration Security Test Cases
Version: 1.0
Derived From: Security Spec v1.0, Security Test Case Specification v1.0

---

## TC-SEC-TEN-REG-001: Argon2 Password Hashing Verification
**Requirement**: SEC-TEN-REG-001
**Steps**:
1. Register a new tenant.
2. Inspect the `users` table record for the admin.
**Expected Result**:
- The `password_hash` field contains an Argon2/Bcrypt hash string, not plaintext.

---

## TC-SEC-TEN-REG-002: Registration Rate Limiting
**Requirement**: SEC-TEN-REG-002
**Steps**:
1. Rapidly submit 10 registration requests from the same IP.
**Expected Result**:
- First 5 requests are processed (success or validation error).
- 6th request and onwards return HTTP 429 Too Many Requests.

---

## TC-SEC-TEN-REG-003: SQL Injection via Organization Name
**Requirement**: SEC-TEN-REG-003
**Steps**:
1. Attempt registration with Organization Name: `' OR '1'='1`.
**Expected Result**:
- Request is either rejected by validation or processed as a literal string.
- No database corruption or unauthorized data retrieval occurs.

---

## TC-SEC-TEN-REG-004: Audit Log Verification
**Requirement**: SEC-TEN-REG-002
**Steps**:
1. Perform a successful registration.
2. Examine the security logs.
**Expected Result**:
- Log entry found for `event_type`: `TENANT_REGISTERED`.
- Contains `actor_ip`, `timestamp`, and the generated `tenant_id`.
