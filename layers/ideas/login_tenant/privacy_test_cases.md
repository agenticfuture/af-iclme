# Privacy Test Cases: Tenant Login (`login_tenant`)

## 1. Overview
These test cases ensure that the login process adheres to PIPEDA and internal privacy policies.

## 2. Test Cases

### TC-PR-LOGIN-001: PII Masking in Audit Logs
- **Objective**: Verify that user emails are masked in application logs.
- **Steps**: 
    1. Perform a login attempt.
    2. Inspect application server logs.
- **Expected Results**: Email address is partially masked (e.g., f****k@domain.com).

### TC-PR-LOGIN-002: Retention Enforcement
- **Objective**: Verify that login history older than 24 months is purged.
- **Steps**: 
    1. Inject a login audit record dated 25 months ago.
    2. Run the retention engine scheduler.
- **Expected Results**: The record is removed from the active database.

### TC-PR-LOGIN-003: Login Consent Capture
- **Objective**: Verify that login activity is linked to consent.
- **Steps**: Check if login events generate a "service use" consent record if not already present.
- **Expected Results**: Valid record in `consent_ledger`.

### TC-PR-LOGIN-004: Password Persistence Check
- **Objective**: Verify passwords are never stored in plain text or logged.
- **Steps**: Search logs and database tables for the plain-text password used in a login attempt.
- **Expected Results**: Zero matches. Only hashed versions (Argon2/Bcrypt) exist in the DB.
