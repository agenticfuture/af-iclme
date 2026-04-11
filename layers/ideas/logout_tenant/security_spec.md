# Security Specification: Tenant Logout (`logout_tenant`)

## 1. Security Model
Logout follows the Zero Trust principle of **session minimalism**.

## 2. Technical Specifications

### SEC-LOGOUT-001: Token Invalidation
- **Stateless (JWT)**: The system shall instruct the client to delete the token. If an invalidation list (blacklist) is implemented, the JTI (JWT ID) must be added to the blacklist for its remaining TTL.
- **Refresh Tokens**: Refresh tokens associated with the session must be deleted from the database.

### SEC-LOGOUT-002: Concurrent Session Logout
- The system should ideally provide an option to "Logout from all devices," which invalidates all active sessions for that user.

### SEC-LOGOUT-003: Anti-CSRF on Logout
- Logout endpoints (if implemented as POST) must be protected by CSRF tokens to prevent attackers from forcing a user to logout.

### SEC-LOGOUT-004: Redirect Validation
- Post-logout redirects must be validated against an allowlist to prevent Open Redirect vulnerabilities.

### SEC-LOGOUT-005: Cookie Cleanup
- Cookies must be cleared by setting an expired `Expires` date and `Max-Age: 0`.
- All security flags (`Secure`, `HttpOnly`, `SameSite`) must match the original session cookie definition to ensure browser-level deletion.
