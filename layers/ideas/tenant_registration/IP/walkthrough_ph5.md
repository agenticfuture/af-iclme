# Tenant Registration - Phase 5 Walkthrough (SaaS Onboarding Integration Skeleton)

## Scope
- Replaced SaaS onboarding server actions that were using Auth0 placeholder management clients for tenant creation / email verification resend.
- Introduced a centralized SaaS server-side tenant registration client helper to call tenant-domain API endpoints:
  - `POST /api/tenant/v1/register`
  - `GET /api/tenant/v1/registrations/{id}`
  - `POST /api/tenant/v1/resend-verification`
- Persisted `registration_id` in a secure HTTP-only cookie so onboarding verify flow can operate on the same tenant registration.

## Files Implemented / Modified (Phase 5)
- `ui-apps/service-gen-saas/lib/tenant-registration-client.ts` (new)
- `ui-apps/service-gen-saas/app/onboarding/create/actions.ts`
- `ui-apps/service-gen-saas/app/onboarding/verify/actions.ts`

## Behavior Changes
### Create Organization (server action)
- Old behavior:
  - `managementClient.organizations.create(...)`
  - add member / add roles (Auth0 placeholder path)
- New behavior:
  - calls tenant-domain register endpoint through `registerTenant(...)`
  - stores `registration_id` in `tenant_registration_id` cookie
  - redirects to `/onboarding/verify`

### Resend Verification (server action)
- Old behavior:
  - `managementClient.jobs.verifyEmail(...)`
- New behavior:
  - reads `tenant_registration_id` from cookie
  - checks tenant registration status (`getTenantRegistrationStatus`)
  - if already active, returns success no-op
  - otherwise calls tenant resend endpoint (`resendTenantVerification`)

## Validation Performed
### TypeScript Compile Validation (inside `service-gen-saas` Docker container)
The first attempt appeared to hang because the polling window was too short. Re-running with a longer wait completed successfully.

```bash
docker exec service-gen-saas sh -lc 'cd /app && pnpm exec tsc --noEmit --pretty false'
```

Observed result:
- exit code `0`
- no output (successful compile)

## Important Notes / Remaining Work
- This is SaaS integration skeleton wiring only.
- It assumes the tenant-domain API routes are mounted in the real API runtime (not only test app scaffolds).
- Full end-to-end onboarding validation still requires:
  - mounting tenant domain in the real API app runtime
  - actual Keycloak + webhook integration path completion
  - browser/e2e flow validation (Playwright) after API integration is live
