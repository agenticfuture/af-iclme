# Risk Specification: Tenant Login (`login_tenant`)

## 1. Overview
This document identifies and assesses the risks associated with the tenant login process and defines the mitigation strategy.

## 2. Identified Risks

### RISK-SEC-2026-LOG-001: Credential Theft (Phishing/Brute-force)
- **Description**: Attackers obtain user credentials via phishing or automated brute-force attacks.
- **Impact**: Unauthorized access to tenant data and services.
- **Inherent Risk**: Critical (20)
- **Mitigation**: 
    - MFA enforcement for admins.
    - IP-based rate limiting.
    - Account lockout policy.
- **Residual Risk**: Low (4)

### RISK-SEC-2026-LOG-002: Session Hijacking (JWT Theft)
- **Description**: Attackers intercept or steal valid JWTs to impersonate users.
- **Impact**: Full access to the active session.
- **Inherent Risk**: High (15)
- **Mitigation**:
    - Force HTTPS for all traffic.
    - Set short expiration times for JWTs.
    - Use `HttpOnly` and `Secure` cookie flags.
- **Residual Risk**: Moderate (6)

### RISK-SEC-2026-LOG-003: Cross-Tenant Data Leakage
- **Description**: A configuration flaw allows a user authenticated in one tenant to access resources of another.
- **Impact**: High (Privacy violation, data breach).
- **Inherent Risk**: Critical (25)
- **Mitigation**:
    - Strict Row-Level Security (RLS) in the database.
    - JWT `tenant_id` validation at the API Gateway.
- **Residual Risk**: Low (5)

### RISK-PRIV-2026-LOG-004: PII Leaked in Logs
- **Description**: Plain-text emails or session IDs are exposed in non-protected logs.
- **Impact**: PIPEDA compliance violation.
- **Inherent Risk**: Moderate (9)
- **Mitigation**:
    - Mandatory PII masking in logging middleware.
    - Log-level control to exclude sensitive payloads from higher-level logging.
- **Residual Risk**: Low (3)

## 3. Monitoring
Risks will be monitored continuously via the Security Information and Event Management (SIEM) system and regular red-team simulations.
