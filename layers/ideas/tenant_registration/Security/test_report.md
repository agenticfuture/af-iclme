# Tenant Registration - Security Layer Test Report
Version: 1.0.0
Layer: Security (L5)
Idea: tenant_registration
Status: PASS (current implemented security scope)

## 1. Summary
Security-layer validation passed for the currently implemented tenant registration controls.

Executed security suite result:
- `16 passed`
- SaaS anti-iframe header e2e: `1 passed`

## 2. What Was Validated
### 2.1 Webhook Security
- Signature validation enforced
- Invalid signature rejected
- Replay detection enforced and persisted via webhook receipts path

### 2.2 OPA Policy Security
- OPA adapter returns decisions
- Fail-closed deny behavior when remote OPA is unreachable
- Policy deny path blocks tenant registration
- CI validator scripts for workflow and OPA coverage run successfully

### 2.3 PII Security
- Encryption utility works (unit level)
- Real registration flow stores PII encrypted-at-rest in `private.user_pii.email_enc`
- Raw plaintext email is not stored in ciphertext bytes

### 2.4 API Protection / Abuse Prevention (real flow)
- IP rate limiting enforced at API boundary
- First 5 requests processed, 6th request returns HTTP 429

### 2.5 Input Sanitization / Injection Safety (real flow)
- SQL injection-style org name (`' OR '1'='1`) handled safely as literal input
- Registration persisted without DB corruption or unintended query behavior

### 2.6 Security Event Persistence (real flow)
- Successful registration creates `TENANT_REGISTERED` record in `tenant_sec.registration_security_events`
- Event contains correlation ID, registration ID, IP, and timestamp

### 2.7 Keycloak Password Hashing (IdP-owned control)
- Test created a Keycloak user and set a password via Keycloak Admin API (real local Keycloak)
- Verified in Keycloak DB (`credential` table) that plaintext password is not stored
- Verified credential metadata contains hashing algorithm information

### 2.8 SaaS Anti-Iframe Embedding Protection
- SaaS app now returns anti-framing headers globally via Next.js headers config:
  - `X-Frame-Options: DENY`
  - `Content-Security-Policy: frame-ancestors 'none'`
- Playwright security header test passed against the running SaaS app:
  - `ui-apps/service-gen-saas/tests/e2e/security-headers.spec.ts`

## 3. Security Findings / Notes
1. PII decryption is not cross-process stable in local dev when `ENCRYPTION_KEY` is blank (ephemeral Fernet key fallback). This is expected for local fallback and does not invalidate encryption-at-rest verification.
2. Security event persistence and rate limiting were added as part of this security-layer hardening phase (they were previously gaps vs spec).
3. Password hashing verification is mapped to Keycloak as control owner (not tenant DB).
4. Raw host-level `curl https://saas.servicegen.local` was not available from this session environment during verification; the anti-framing control was validated through the running `playwright-test` service against the live SaaS app.
