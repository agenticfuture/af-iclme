# Risks Test Cases: Tenant Login (`login_tenant`)

## 1. Overview
Validation of risk mitigation controls through targeted security testing and simulation.

## 2. Test Cases

### TC-RISK-LOGIN-001: Brute-Force Mitigation Check
- **Objective**: Verify that RISK-SEC-2026-LOG-001 is mitigated.
- **Steps**: Attempt 50 logins for a single account from a single IP.
- **Expected Results**: Throttled after 10 attempts, locked after 5 failures.

### TC-RISK-LOGIN-002: JWT Replay/Expiration Check
- **Objective**: Verify that expired JWTs are rejected.
- **Steps**: 
    1. Capture a valid JWT.
    2. Wait for expiration.
    3. Attempt to use it.
- **Expected Results**: 401 Unauthorized.

### TC-RISK-LOGIN-003: Cross-Tenant Resource Attempt
- **Objective**: Verify that RISK-SEC-2026-LOG-003 is mitigated.
- **Steps**: Use a valid Tenant A token to call a Tenant B specific API endpoint (e.g., `/api/tenant-b/settings`).
- **Expected Results**: 403 Forbidden.

### TC-RISK-LOGIN-004: Log Audit for PII
- **Objective**: Verify RISK-PRIV-2026-LOG-004 is mitigated.
- **Steps**: Initiate a login and grep the logs for the exact email address used.
- **Expected Results**: No exact match found (only masked version should appear).
