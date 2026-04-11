# Security Test Cases: Tenant Login (`login_tenant`)

## 1. Overview
Validation of security controls defined in the security specification.

## 2. Test Cases

### TC-SEC-LOGIN-001: SQL Injection Protection
- **Objective**: Verify the login form is resistant to SQLi.
- **Steps**: Submit `' OR '1'='1` in the email field.
- **Expected Results**: Request rejected by WAF or sanitized by the application. No DB error.

### TC-SEC-LOGIN-002: JWT Tampering
- **Objective**: Verify that modifying the `tenant_id` in a JWT causes a rejection.
- **Steps**: 
    1. Obtain a valid JWT for Tenant A.
    2. Change `tenant_id` to Tenant B in the payload (without resigning).
    3. Access a protected resource.
- **Expected Results**: 401 Unauthorized (Signature mismatch).

### TC-SEC-LOGIN-003: MFA Bypass Attempt
- **Objective**: Verify that an admin cannot access the dashboard without providing the MFA token.
- **Steps**: Login as admin with correct password but skip the MFA input step or provided an invalid one.
- **Expected Results**: Access denied. User remains on MFA challenge screen.

### TC-SEC-LOGIN-004: Rate Limit Verification
- **Objective**: Verify IP-based throttling.
- **Steps**: Script 20 login attempts within 30 seconds.
- **Expected Results**: Subsequent requests return HTTP 429.

### TC-SEC-LOGIN-005: Secure Header Check
- **Objective**: Verify security headers are present in the response.
- **Steps**: Inspect response headers for `Strict-Transport-Security`, `X-Content-Type-Options`.
- **Expected Results**: Correct headers present.
