# Phase 13 Walkthrough - SaaS Keycloak Signup Redirect Fix + Real Browser Redirect Contract E2E

## Objective
Fix real SaaS signup redirect to Keycloak (realm/client/callback mismatch) and validate it with a real browser e2e, while preserving the onboarding -> tenant API -> DB save e2e.

## Root Cause Found
SaaS signup (`/register`) used client-side `lib/keycloak-client.ts` with mismatched/hardcoded values:
- hardcoded `CLIENT_ID='service-gen-saas'`
- realm/client/callback env mismatch across `.env.local` / `.env.secrets`
- callback was pointing to `https://api.servicegen.local/auth/callback`

This produced a Keycloak URL that did not match the intended local realm/client configuration.

## Changes Applied

### 1. SaaS env alignment (realm/client/callback)
Patched:
- `ui-apps/service-gen-saas/.env.local`
- `ui-apps/service-gen-saas/.env.secrets`

Updated to:
- `AUTH_KEYCLOAK_ID=saas-servicegen`
- `AUTH_KEYCLOAK_ISSUER=http://keycloak:8080/realms/saas-servicegen`
- `NEXT_PUBLIC_KEYCLOAK_REALM=saas-servicegen`
- `NEXT_PUBLIC_CLIENT_ID=saas-servicegen`
- `NEXT_PUBLIC_REDIRECT_URI=https://saas.servicegen.local/auth/callback`

### 2. Keycloak realm/client provisioning (local Docker Keycloak)
In `sg_keycloak` container:
- created realm `saas-servicegen`
- created client `saas-servicegen`
- configured redirect URI:
  - `https://saas.servicegen.local/auth/callback`
- configured web origin:
  - `https://saas.servicegen.local`
- aligned SaaS env `AUTH_KEYCLOAK_SECRET` to actual generated client secret

### 3. Browser signup code fix (`/register` path)
Patched `ui-apps/service-gen-saas/lib/keycloak-client.ts`:
- `CLIENT_ID` now uses `process.env.NEXT_PUBLIC_CLIENT_ID`
- `REDIRECT_URI` now respects `process.env.NEXT_PUBLIC_REDIRECT_URI` (with existing fallback)

This was the critical runtime bug preventing env-only fixes from taking effect.

### 4. New Playwright e2e: real `/register` redirect contract
Added:
- `ui-apps/service-gen-saas/tests/e2e/register-keycloak-redirect.spec.ts`

What it validates (real browser flow):
- `/register` form submission triggers Keycloak navigation
- URL host is `https://auth.servicegen.local`
- path is Keycloak registration endpoint for the configured realm:
  - `/realms/saas-servicegen/protocol/openid-connect/registrations`
- `client_id=saas-servicegen`
- `redirect_uri=https://saas.servicegen.local/auth/callback`
- `response_type=code`
- `scope` contains `openid`
- `state` present

Implementation detail:
- intercepts `https://auth.servicegen.local/**` in Playwright to validate URL contract without DNS/TLS dependency

### 5. Existing onboarding e2e stabilization
Patched:
- `ui-apps/service-gen-saas/tests/e2e/tenant-onboarding.spec.ts`
  - `waitForURL(..., { waitUntil: "domcontentloaded" })`
  - increased timeout to `180_000` (Next.js dev compile latency)

Patched local onboarding action to avoid duplicate 409s caused by fixed mock auth shim email:
- `ui-apps/service-gen-saas/app/onboarding/create/actions.ts`
- When session email is `mock@example.com`, generate a unique alias email from org name + timestamp (local test shim case only)

## Docker Validations Performed

### Recreate SaaS container with updated envs
- `docker compose -f docker-compose.generated.yml up -d --force-recreate service-gen-saas`

### Keycloak provisioning validation
- `kcadm.sh` used inside `sg_keycloak`
- verified realm `saas-servicegen`
- verified client `saas-servicegen` redirect/web origins

### Playwright (reusable runner service)
Command used:
- `docker exec playwright-test sh -lc 'cd /work && export NODE_PATH=$(npm root -g) && playwright test tests/e2e/register-keycloak-redirect.spec.ts tests/e2e/tenant-onboarding.spec.ts --workers=1 --reporter=line'`

Final result:
- `2 passed (36.5s)`

## Outcome
- Real browser signup path (`/register`) now builds a correct Keycloak URL for:
  - realm `saas-servicegen`
  - client `saas-servicegen`
  - callback `https://saas.servicegen.local/auth/callback`
- Onboarding e2e still validates tenant registration persistence path (tenant API -> DB) and passes.

## Remaining Scope (Not Yet Automated)
This phase fixes the real redirect defect and validates redirect contract + onboarding DB persistence. It does **not** yet fully automate:
- complete browser signup inside Keycloak UI
- email verification mailbox handling
- callback + tenant onboarding in one continuous real-user signup e2e

That requires selecting an email verification test strategy (mail sink, test realm auto-verify, webhook test harness, or callback shortcut for CI).
