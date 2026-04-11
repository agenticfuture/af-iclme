# Tenant Registration Requirements Specification
Version: 1.0
Derived From: ServiceGen BRD v0.9.0 (BR-TEN-001)
Status: Draft

---

# 1. Functional Requirements

## REQ-TEN-REG-001: Register Tenant Account
**Description**: The system must allow an organization to register a new tenant account.
**Business Rules**:
- Each tenant must have a unique identifier (UUID).
- One user must be assigned as the initial Administrator.
- Email verification is mandatory before account activation.
**Data Fields**:
- Organization Name
- Admin Email
- Admin Password
- Primary Language
- Regulatory Region

## REQ-TEN-REG-002: Administrator Role Assignment
**Description**: The system must automatically assign the 'Admin' role to the first user created during registration.
**Business Rule**: Only one initial administrator is created via the registration flow.

## REQ-TEN-REG-003: Email Verification Workflow
**Description**: A verification email containing a secure link must be sent to the admin email address provided.
**Constraint**: The tenant account remains in 'Draft' or 'Inactive' status until the link is clicked.

---

# 2. Non-Functional Requirements

## NFR-TEN-REG-001: Service Creation Performance
**Target**: Tenant record and associated initial service stub must be created in < 1 second.

## NFR-TEN-REG-002: Security - Password Policy
**Requirement**: Must enforce Argon2 or Bcrypt hashing and complexity requirements as per `security-system-spec`.

---

# 3. Acceptance Criteria
- [ ] Tenant record successfully persisted in the `tenants` table.
- [ ] Admin user successfully persisted in the `users` table linked to the tenant.
- [ ] Verification email triggered and logged.
- [ ] System prevents registration with an existing email address.
