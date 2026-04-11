# Requirements Specification: Tenant Login (`login_tenant`)

## 1. Introduction
This document specifies the functional and non-functional requirements for the Tenant Login feature within the ServiceGen platform. This feature is the primary entry point for tenant administrators and users to access their respective environments.

## 2. Functional Requirements

### FR-LOGIN-001: Secure Authentication
The system shall authenticate users using email and password credentials.
- **Traceability**: BR-TEN-002: Authentication
- **Rules**:
    - Credentials must be validated against the secure identity store.
    - Password hashing must use Argon2 or Bcrypt (as per security specs).

### FR-LOGIN-002: Multi-MFA Support
The system shall support Multi-Factor Authentication (MFA) using TOTP (Time-based One-Time Password).
- **Traceability**: Security Spec (IAM section)
- **Rules**: 
    - MFA is mandatory for `admin` and `tenant_admin` roles.

### FR-LOGIN-003: Session Management
Upon successful authentication, the system shall issue a secure, time-bound JWT (JSON Web Token).
- **Traceability**: BR-TEN-002: Authentication
- **Rules**:
    - JWT must contain `user_id`, `tenant_id`, and `role`.
    - Signing algorithm: RS256.

### FR-LOGIN-004: Tenant Isolation Enforcement
All login attempts and subsequent sessions must be strictly scoped to the user's `tenant_id`.
- **Traceability**: NFR-01: Multi-Tenancy Isolation
- **Rules**:
    - No cross-tenant access is permitted during the login flow.

### FR-LOGIN-005: Password Recovery
The system shall allow users to reset their passwords via a secure email-based verification process.

## 3. Non-Functional Requirements

### NFR-LOGIN-001: Security
- All authentication traffic must be encrypted via HTTPS.
- Rate limiting should be applied to prevent brute-force attacks.

### NFR-LOGIN-002: Performance
- Authentication response (login button click to dashboard redirect) should be < 2 seconds.

### NFR-LOGIN-003: Privacy
- Login events must be logged in the audit trail without exposing plain-text credentials.
- PII masking should be applied to audit logs where applicable.
