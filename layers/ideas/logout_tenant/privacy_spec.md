# Privacy Specification: Tenant Logout (`logout_tenant`)

## 1. Compliance Framework
This document aligns with **PIPEDA** for the ServiceGen platform logout process.

## 2. Privacy Controls

### PR-LOGOUT-001: Data Minimization (Client-side)
The logout process must ensure that all user-specific PII (e.g., email, name) stored in the browser's persistent storage is deleted.
- **Traceability**: PIPEDA Principle: Limiting Use/Retention.

### PR-LOGOUT-002: Audit Logging
The logout event must be logged with:
- `tenant_id`
- `user_id`
- Timestamp
- Action: LOGOUT
- **Rules**: IP address should be logged if required for security investigation, otherwise masked in standard reports.

### PR-LOGOUT-003: Retention
Logout logs follow the standard 24-month retention policy defined in the parent Privacy Spec.

### PR-LOGOUT-004: Embedding Cache Cleanup
If the client-side UI caches any LLM response fragments or embeddings for performance, these must be purged upon logout.

## 3. Residency
Logout events for Canadian tenants must be stored and processed within the **Canada** region.
