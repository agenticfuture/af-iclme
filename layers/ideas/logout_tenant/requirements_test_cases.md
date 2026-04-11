# Requirements Test Cases: Tenant Logout (`logout_tenant`)

## 1. Overview
These test cases validate that the logout process correctly terminates sessions and cleans up the environment.

## 2. Test Cases

### TC-LOGOUT-FUN-001: Standard Logout
- **Objective**: Verify that a user can successfully logout from the dashboard.
- **Preconditions**: User is logged in.
- **Steps**:
    1. Click "Logout" in the user menu.
- **Expected Results**:
    - Redirected to login page.
    - Local storage tokens are empty.
    - Session cookies are cleared.

### TC-LOGOUT-FUN-002: Back Button Prevention
- **Objective**: Verify that a user cannot return to the authenticated view using the browser's "Back" button after logout.
- **Steps**:
    1. Perform logout.
    2. Click browser "Back" button.
- **Expected Results**: User is either kept on the login page or redirected to login if a protected route is requested. No authenticated data is visible.

### TC-LOGOUT-FUN-003: Multiple Tabs Logout
- **Objective**: Verify that logging out in one tab invalidates the session in other tabs.
- **Steps**:
    1. Open dashboard in Tab A and Tab B.
    2. Logout in Tab A.
    3. Perform any action in Tab B.
- **Expected Results**: Tab B detects session termination and redirects to login (or returns 401/403 on next API call).

### TC-LOGOUT-FUN-004: Token Invalidation Check
- **Objective**: Verify that a previously valid token cannot be used after logout.
- **Steps**: 
    1. Copy the JWT before logging out.
    2. Perform logout.
    3. Manually attempt an API call using the copied JWT.
- **Expected Results**: API returns 401 Unauthorized.
