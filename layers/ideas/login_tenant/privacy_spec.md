# Privacy Specification: Tenant Login (`login_tenant`)

## 1. Compliance Framework
This document aligns with **PIPEDA** (Personal Information Protection and Electronic Documents Act) for the ServiceGen platform.

## 2. Privacy Controls

### PR-LOGIN-001: Minimal Data Collection
The login process shall only collect the minimum amount of PII necessary (Email) for authentication.

### PR-LOGIN-002: Consent Management
Login implies agreement with the platform's Terms of Service and Privacy Policy. Any marketing-related identifiers must be governed by the `consent_ledger`.

### PR-LOGIN-003: Data Retention & Deletion
- Login activity logs (IP, timestamp, email) shall be retained for a maximum of 24 months (as per security specs).
- Upon tenant account deletion, all associated login audit logs must be hard-deleted from the production database.

### PR-LOGIN-004: Audit Logging (Privacy Focused)
- Passwords MUST NEVER be logged.
- Failed login attempts should log the email used but must be stored in encrypted format if exported to low-security environments.

### PR-LOGIN-005: PII Masking
PII (emails) in diagnostic logs must be masked (e.g., u***r@example.com) before ingestion by LLM-based troubleshooting tools.

## 3. Residency
In accordance with residency requirements, all authentication data for Canadian tenants must remain within the **Canada** region.
