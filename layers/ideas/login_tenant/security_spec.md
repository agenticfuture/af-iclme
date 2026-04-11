# Security Specification: Tenant Login (`login_tenant`)

## 1. Security Architecture
The login system follows a **Zero Trust** model with defense-in-depth principles.

## 2. Technical Specifications

### SEC-LOGIN-001: Identity & Access Management (IAM)
- **Primary Auth**: JWT (RS256).
- **MFA**: Mandatory for `admin` and `tenant_admin` roles using TOTP.
- **Password Hashing**: Argon2 with a minimum cost factor of 12.

### SEC-LOGIN-002: Network Security
- **Enforced Encryption**: TLS 1.2 or higher for all traffic. HSTS enabled.
- **WAF Rules**: Protection against SQLi, XSS, and Credential Stuffing on the login endpoint.

### SEC-LOGIN-003: Tenant Isolation
- **JWT Validation**: Every request must validate that the `tenant_id` in the token matches the requested resource sub-domain.
- **Isolation Guard**: Database queries for session lookup must include a hardcoded `tenant_id` filter (RLS).

### SEC-LOGIN-004: Anti-Abuse & Rate Limiting
- **IP-based Throttle**: Max 10 attempts per minute per IP.
- **Account Lockout**: After 5 failed attempts, the account is locked for 30 minutes.

### SEC-LOGIN-005: Secure Cookies
If cookies are used for session persistence:
- `HttpOnly`: true
- `Secure`: true
- `SameSite`: Strict
