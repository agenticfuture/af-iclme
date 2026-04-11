# Risk Specification: Tenant Logout (`logout_tenant`)

## 1. Overview
This document identifies and assesses the risks associated with the logout process, focusing on session persistence and malicious logout triggers.

## 2. Identified Risks

### RISK-SEC-2026-LOGO-001: Session Persistence after Logout
- **Description**: A user or attacker is able to continue accessing the system using a session token that should have been invalidated.
- **Impact**: Unauthorized access to tenant data.
- **Inherent Risk**: Critical (20)
- **Mitigation**:
    - Server-side JTI blacklisting for JWTs.
    - Forced deletion of all session-related cookies and client storage.
- **Residual Risk**: Low (4)

### RISK-SEC-2026-LOGO-002: Malicious Logout (CSRF)
- **Description**: An attacker tricks an authenticated user into clicking a link that triggers a logout, causing a Denial of Service for the user's active workflow.
- **Impact**: Professional disruption, loss of unsaved work.
- **Inherent Risk**: Moderate (8)
- **Mitigation**:
    - Implementation of Anti-CSRF tokens on the logout endpoint.
- **Residual Risk**: Low (2)

### RISK-SEC-2026-LOGO-003: Open Redirect on Logout
- **Description**: The logout process redirects the user to an arbitrary external URL sensitive to phishing.
- **Impact**: Credential theft via phishing landing page.
- **Inherent Risk**: Moderate (10)
- **Mitigation**:
    - Strict allowlist for post-logout redirect URLs.
- **Residual Risk**: Low (2)

### RISK-PRIV-2026-LOGO-004: PII leakage in Logout logs
- **Description**: Sensitive PII is included in the logout audit logs without masking.
- **Impact**: Privacy compliance violation.
- **Inherent Risk**: Low (6)
- **Mitigation**:
    - Mandatory logout log schema that excludes sensitive fields.
- **Residual Risk**: Minimal (1)

## 3. Monitoring
SIEM alerts will be triggered for any 2xx response from logout followed by a 2xx response from a protected API using the same JTI.
