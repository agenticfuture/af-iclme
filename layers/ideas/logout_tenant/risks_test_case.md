# Risks Test Cases: Tenant Logout (`logout_tenant`)

## 1. Overview
Validation of risk mitigation controls for the logout flow.

## 2. Test Cases

### TC-RISK-LOGO-001: Session Death Verification
- **Objective**: Verify that RISK-SEC-2026-LOGO-001 is mitigated.
- **Steps**:
    1. Login. 
    2. Perform logout.
    3. Attempt to use the pre-logout JWT to access `/api/me`.
- **Expected Results**: 401 Unauthorized.

### TC-RISK-LOGO-002: CSRF Logout Resistance
- **Objective**: Verify that RISK-SEC-2026-LOGO-002 is mitigated.
- **Steps**:
    1. Create a simple HTML page with an `<img src="/api/logout">` or a hidden form.
    2. Visit the page while authenticated.
- **Expected Results**: User is NOT logged out (request fails due to missing CSRF token).

### TC-RISK-LOGO-003: Redirect Hijack Attempt
- **Objective**: Verify that RISK-SEC-2026-LOGO-003 is mitigated.
- **Steps**:
    1. Attempt to logout with `?redirect=http://google.com`.
- **Expected Results**: Redirected to the internal default login page instead of Google.

### TC-RISK-LOGO-004: Audit Log PII Verification
- **Objective**: Verify RISK-PRIV-2026-LOGO-004 is mitigated.
- **Steps**:
    1. Perform logout.
    2. Inspect the audit log for that event.
- **Expected Results**: No plain-text passwords or unmasked sensitive PII found.
