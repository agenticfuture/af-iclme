# Logout Tenant Implementation Plan v1.0.0

## Scope
Implement `logout_tenant` end-to-end across tenant domain and SaaS app with security/privacy/risk controls from the logout idea specs.

## Phase 1 (Backend foundation)
1. Add tenant capability `logout_tenant` under `capabilities/tenant/caps/logout_tenant/`.
2. Add `LogoutTenantRequest/Response` contracts.
3. Add tenant domain API method and route: `POST /api/tenant/v1/logout`.
4. Enforce gateway policy metadata (`auth_required=True`) on logout route.
5. Add redirect allowlist validation and CSRF-origin validation helpers.
6. Add structured logout security/audit event emission.
7. Add unit tests for validation/workflow/domain method.

## Phase 2 (SaaS flow)
1. Add Next.js route handler `/auth/logout`.
2. Call backend logout endpoint with session context.
3. Clear all auth/session/scope cookies with correct flags.
4. Redirect to login/public page using validated redirect.
5. Update UI logout entry points to use `/auth/logout`.
6. Add client cleanup trigger for local/session storage.

## Phase 3 (Security hardening)
1. Implement anti-CSRF checks on logout POST (origin + token strategy).
2. Validate post-logout redirect against allowlist.
3. Ensure no open redirects.
4. Ensure no PII in logout logs.

## Phase 4 (Privacy and risk controls)
1. Add privacy assertions for browser storage cleanup.
2. Add audit retention assertions for logout events.
3. Add token replay regression tests after logout.
4. Add multi-tab/back-button behavior tests.

## Test Strategy
- Unit: capability functions/workflow, redirect validator, CSRF validator.
- Integration: tenant logout endpoint behavior and audit outputs.
- E2E: dashboard logout click -> login redirect -> protected route denial.

## Traceability targets
- FR-LOGOUT-001/002/003/004
- SEC-LOGOUT-001/003/004/005
- PR-LOGOUT-001/002/003/004
- RISK-SEC-2026-LOGO-001/002/003
- RISK-PRIV-2026-LOGO-004
