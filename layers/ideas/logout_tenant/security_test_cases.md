# Security Test Cases: Tenant Logout (`logout_tenant`)

## 1. Overview
Validation of session security during and after logout.

## 2. Test Cases

### TC-SEC-LOGOUT-001: Token Replay Prevention
- **Objective**: Verify that a token cannot be used after the logout action is recorded on the server.
- **Steps**:
    1. Login.
    2. Extract JWT.
    3. Logout.
    4. Call a protected API with the extracted JWT.
- **Expected Results**: 401 Unauthorized (if blacklist is active) or redirect to login.

### TC-SEC-LOGOUT-002: CSRF on Logout Attack
- **Objective**: Verify that an attacker cannot logout a user via a malicious link.
- **Steps**:
    1. Create a page with an auto-submitting form targeting the logout endpoint.
    2. Visit the page while logged into ServiceGen in another tab.
- **Expected Results**: The logout request should be blocked (if CSRF protected) or require a valid CSRF token.

### TC-SEC-LOGOUT-003: Open Redirect Check
- **Objective**: Verify that the logout redirect cannot be manipulated.
- **Steps**:
    1. Craft a logout URL with a malicious redirect: `/logout?redirect=https://evil.com`.
    2. Visit the URL.
- **Expected Results**: Redirected to the default login page or an error is displayed. Access to `evil.com` is blocked.

### TC-SEC-LOGOUT-004: Persistent Cookie Investigation
- **Objective**: Verify no cookies remain with sensitive values.
- **Steps**: 
    1. Perform logout.
    2. Check browser dev tools for any cookies with the name `jwt`, `token`, or `sid`.
- **Expected Results**: No such cookies exist.
