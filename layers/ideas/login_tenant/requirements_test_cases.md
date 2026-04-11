# Requirements Test Cases: Tenant Login (`login_tenant`)

## 1. Overview
These test cases validate the functional aspects of the tenant login process, including authentication, MFA, and session issuance.

## 2. Test Cases

### TC-LOGIN-FUN-001: Successful Login (Standard User)
- **Objective**: Verify that a standard user can login with valid credentials.
- **Preconditions**: User exists with valid password.
- **Steps**:
    1. Navigate to login page.
    2. Enter valid email and password.
    3. Click "Login".
- **Expected Results**:
    - Redirected to dashboard.
    - JWT issued and stored in browser session.
    - Login event captured in audit logs.

### TC-LOGIN-FUN-002: Successful Login (Admin with MFA)
- **Objective**: Verify that an admin must complete MFA.
- **Preconditions**: Admin user exists with MFA enabled.
- **Steps**:
    1. Enter valid admin email and password.
    2. Prompted for MFA code.
    3. Enter valid TOTP code.
- **Expected Results**: Access granted after MFA completion.

### TC-LOGIN-FUN-003: Invalid Password Attempt
- **Objective**: Verify authentication failure for incorrect password.
- **Steps**: Enter valid email but incorrect password.
- **Expected Results**: Access denied. "Invalid credentials" error message displayed.

### TC-LOGIN-FUN-004: Brute Force Protection
- **Objective**: Verify account lockout after repeated failures.
- **Steps**: Submit incorrect password 5 times consecutively.
- **Expected Results**: Account temporarily locked. Alert triggered in security logs.

### TC-LOGIN-FUN-005: Cross-Tenant Access Denial
- **Objective**: Verify that a user cannot login to a different tenant's sub-domain/environment.
- **Steps**: Attempt to use credentials from Tenant A on Tenant B's login endpoint.
- **Expected Results**: Authentication fails or access is restricted to Tenant A scope only.
