# Privacy Test Cases: Tenant Logout (`logout_tenant`)

## 1. Overview
Validation of privacy controls during the logout flow.

## 2. Test Cases

### TC-PR-LOGOUT-001: Storage Cleanup Verification
- **Objective**: Verify that PII is removed from the browser.
- **Steps**:
    1. Login and navigate to a view that caches user profile data in localStorage.
    2. Perform logout.
    3. Inspect browser localStorage/sessionStorage.
- **Expected Results**: All user-specific keys are deleted.

### TC-PR-LOGOUT-002: Audit Trail Entry
- **Objective**: Verify that a logout event is correctly recorded.
- **Steps**:
    1. Perform logout.
    2. Check the `audit_logs` database table.
- **Expected Results**: A record exists with the correct user/tenant IDs and action "LOGOUT".

### TC-PR-LOGOUT-003: Cookie Deletion
- **Objective**: Verify that session cookies are removed.
- **Steps**:
    1. Inspect browser cookies before logout.
    2. Perform logout.
    3. Inspect browser cookies after logout.
- **Expected Results**: Session-related cookies (e.g., `session_id`, `jwt`) are gone.
