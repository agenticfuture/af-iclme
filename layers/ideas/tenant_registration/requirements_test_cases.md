# Tenant Registration Test Case Specification
Version: 1.0
Derived From: Requirements Spec v1.0, BRD v0.9.0

---

## TC-TEN-REG-001: Successful Tenant Registration
**Requirement**: REQ-TEN-REG-001
**Preconditions**: Valid unique email address, organization name.
**Steps**:
1. Navigate to Registration page.
2. Enter Organization Name, Admin Email, Password.
3. Submit form.
**Expected Result**:
- Success message displayed.
- Tenant record found in database.
- Admin user found in database with 'Admin' role.
- Account status is 'Pending Verification'.

---

## TC-TEN-REG-002: Duplicate Email Prevention
**Requirement**: REQ-TEN-REG-001
**Preconditions**: An account already exists for 'admin@example.com'.
**Steps**:
1. Attempt to register with 'admin@example.com'.
**Expected Result**:
- Error message: "Email already registered."
- No new tenant or user records created.

---

## TC-TEN-REG-003: Password Complexity Validation
**Requirement**: NFR-TEN-REG-002
**Steps**:
1. Attempt registration with password '123'.
**Expected Result**:
- Validation error message describing complexity requirements.

---

## TC-TEN-REG-004: Email Verification Trigger
**Requirement**: REQ-TEN-REG-003
**Steps**:
1. Complete successful registration (TC-TEN-REG-001).
**Expected Result**:
- Email sending service logs show verification email sent to the provided address.
