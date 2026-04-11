# Login Tenant Implementation Plan v1.0.0

## Scope check first
I reviewed all `login_tenant` specs under:
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/af-iclme/layers/ideas/login_tenant/*`

There is a gap in provided inputs:
- `workflow.md` and `workflow.yml` are referenced in the execution prompt but not present in `/af-iclme/layers/ideas/login_tenant/`.

## Current implementation state (relevant to plan)
- Auth is centered on Keycloak auth-code callback in `/capabilities/auth/caps/handle_auth/*`.
- Session token creation currently uses `HS256`, not `RS256`.
- Tenant scope fields are already propagated (`org_id`, `tenant_id`) into session payload and SaaS context.
- Tenant registration already has strong security/privacy tests and controls (rate limiting, audit, consent ledger, PII encryption).

---

## Section 1: Proposed implementation plan

### A) Expected implemented code
Implement `login_tenant` as a tenant-domain login capability integrated with Keycloak + auth domain (not standalone password auth in ServiceGen API).

- Add capability package:
  - `capabilities/tenant/caps/login_tenant/handler.py`
  - `capabilities/tenant/caps/login_tenant/workflow.py`
  - `capabilities/tenant/caps/login_tenant/functions.py`
  - `capabilities/tenant/caps/login_tenant/entities.py`
  - `capabilities/tenant/caps/login_tenant/contracts.py`
- Add tenant API entrypoint wrappers in tenant factory:
  - `capabilities/tenant/factory.py`
- Add auth-side hardening for login requirements:
  - switch session signing from HS256 to RS256 (or opaque session strategy if project standard)
  - enforce tenant-scope check on callback completion before session issue
  - add login audit event emission with masked identifiers
  - files:
    - `capabilities/auth/caps/handle_auth/functions.py`
    - `capabilities/auth/caps/handle_auth/api.py`
- Add anti-abuse + lockout policy integration:
  - reuse rate-limiter pattern from tenant registration
  - add failed-login counters/lockout storage adapter
  - add DB persistence for lockout window and failed counts under tenant DB adapter
- Add privacy controls:
  - mask email in operational logs
  - store hashed/masked identifiers for low-trust log exports
  - add retention purge job entrypoint for login audit >24 months
- SaaS app:
  - keep current UI redirect to IdP
  - add explicit tenant mismatch handling screen on callback failure
  - enforce strict cookie config (`HttpOnly`, `Secure`, `SameSite=Strict` where compatible)

### B) Expected implemented tests
Add tests in four groups:

- Functional (`requirements_test_cases`):
  - valid login
  - admin/tenant_admin MFA required
  - invalid credentials
  - brute-force/lockout behavior
  - cross-tenant login denial

- Security (`security_test_cases`):
  - SQLi payload handling at login boundary
  - JWT tamper rejection
  - MFA bypass rejection
  - 429 throttle and lockout durations
  - security headers and secure cookie flags

- Privacy (`privacy_test_cases`):
  - masked email logs
  - 24-month retention purge behavior
  - consent linkage behavior for login activity
  - zero plaintext password persistence in app DB/logs

- Risk (`risks_test_case`):
  - high-volume brute-force simulation
  - expired/replayed token rejection
  - tenant boundary API denial with mismatched tenant token
  - PII grep scan over runtime logs

### C) Traceability matrix (plan)
| Spec ID | Planned code area | Planned tests |
|---|---|---|
| FR-LOGIN-001 | `tenant/caps/login_tenant/*`, `auth/caps/handle_auth/*` | TC-LOGIN-FUN-001, TC-LOGIN-FUN-003 |
| FR-LOGIN-002 | Keycloak MFA policy + callback enforcement in auth flow | TC-LOGIN-FUN-002, TC-SEC-LOGIN-003 |
| FR-LOGIN-003 | Session issuance/signing in `handle_auth/functions.py` | TC-LOGIN-FUN-001, TC-SEC-LOGIN-002, TC-RISK-LOGIN-002 |
| FR-LOGIN-004 | tenant/org scope validation in callback + API guard | TC-LOGIN-FUN-005, TC-RISK-LOGIN-003 |
| FR-LOGIN-005 | password reset route + Keycloak action integration | functional reset e2e (to be added) |
| SEC-LOGIN-001 | IAM hardening + MFA + crypto config | TC-SEC-LOGIN-002, TC-SEC-LOGIN-003 |
| SEC-LOGIN-002 | TLS/HSTS/header checks + gateway policy | TC-SEC-LOGIN-005 |
| SEC-LOGIN-003 | JWT tenant validation + DB RLS checks | TC-SEC-LOGIN-002, TC-RISK-LOGIN-003 |
| SEC-LOGIN-004 | rate limiter + lockout persistence | TC-SEC-LOGIN-004, TC-RISK-LOGIN-001 |
| SEC-LOGIN-005 | cookie options in callback response | TC-SEC-LOGIN-005 |
| PR-LOGIN-001 | minimal login payload and stored fields | TC-PR-LOGIN-004 |
| PR-LOGIN-002 | consent linkage for login events | TC-PR-LOGIN-003 |
| PR-LOGIN-003 | retention purge job for login audit | TC-PR-LOGIN-002 |
| PR-LOGIN-004 | sensitive field redaction in logs | TC-PR-LOGIN-004, TC-PR-LOGIN-001 |
| PR-LOGIN-005 | masking middleware for diagnostics | TC-PR-LOGIN-001, TC-RISK-LOGIN-004 |
| RISK-SEC-2026-LOG-001 | MFA + lockout + throttling | TC-RISK-LOGIN-001 |
| RISK-SEC-2026-LOG-002 | secure session and expiry checks | TC-RISK-LOGIN-002 |
| RISK-SEC-2026-LOG-003 | strict tenant isolation checks | TC-RISK-LOGIN-003 |
| RISK-PRIV-2026-LOG-004 | PII masking in logs | TC-RISK-LOGIN-004 |

---

## Section 2: Additional relevant artifacts
- Prompt artifact path:
  - `af-iclme/layers/ideas/login_tenant/changes/CHG-<id>/prompts-<id>`
  - content: execution prompt + assumptions (Keycloak as IdP, no local password auth)
- Change artifact path:
  - `af-iclme/layers/ideas/login_tenant/changes/CHG-<id>/change-<id>`
  - content: file-by-file deltas, risk notes, rollback notes
- Walkthrough artifact path:
  - `af-iclme/layers/ideas/login_tenant/changes/CHG-<id>/walkthrough-<id>`
  - content: container commands, evidence, pass/fail matrix

---

## Execution order
1. Finalize auth model decision for FR-LOGIN-001: Keycloak-only credential verification.
2. Add `tenant/caps/login_tenant` workflow and API surface.
3. Enforce tenant-scope + session hardening in auth callback.
4. Add lockout/rate-limit persistence for login attempts.
5. Add privacy logging/masking and retention purge.
6. Add complete functional/security/privacy/risk tests and run in Docker real mode.
7. Generate traceability report and evidence package.
