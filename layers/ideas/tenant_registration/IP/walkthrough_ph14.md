# Phase 14 Walkthrough - Home Page Sign In/Sign Up Keycloak Redirect Fix (Real SaaS Runtime)

## Objective
Validate and fix the *actual* SaaS home-page auth button redirects (`/`, buttons: `Sign In` and `Sign Up`) after the user reported the live URL was still wrong (`realm=servicegen-saas`).

## Root Cause Found
The SaaS app had two auth URL generation paths:
1. `/register` page -> `lib/keycloak-client.ts`
2. `/` home page buttons -> `lib/auth.ts` (`buildAuthUrl(...)`)

Even after fixing `/register`, the live `service-gen-saas` container still had:
- `NEXT_PUBLIC_REALM=servicegen-saas`

So the home-page buttons were still building URLs for the wrong realm.

## Fixes Applied

### 1. Corrected live home-page realm input
Patched:
- `ui-apps/service-gen-saas/.env.local`

Set:
- `NEXT_PUBLIC_REALM=saas-servicegen`

Verified in the running `service-gen-saas` container:
- `NEXT_PUBLIC_REALM=saas-servicegen`
- `NEXT_PUBLIC_CLIENT_ID=saas-servicegen`
- `NEXT_PUBLIC_REDIRECT_URI=https://saas.servicegen.local/auth/callback`

### 2. Keycloak realm registration settings
In `sg_keycloak` (realm `saas-servicegen`):
- enabled self-registration (`registrationAllowed=true`)
- set realm display name to `ServiceGen`

### 3. Restored SaaS compose startup command
`service-gen-saas` crash-looped after recreate because compose command had been changed to `pnpm dev` only.
Patched `docker-compose.generated.yml` back to a bootstrap command:
- `npm install -g pnpm && pnpm install && pnpm dev`

This restored stable SaaS runtime startup in Docker.

## Real Browser Tests Added/Validated

### New test covering the exact reported path (`/` home page buttons)
Added:
- `ui-apps/service-gen-saas/tests/e2e/home-auth-redirects.spec.ts`

Validates:
- Home `Sign In` button -> Keycloak OIDC auth URL with:
  - realm `saas-servicegen`
  - client `saas-servicegen`
  - redirect `https://saas.servicegen.local/auth/callback`
  - PKCE params present
  - no `kc_action`
- Home `Sign Up` button -> same Keycloak OIDC auth URL plus:
  - `kc_action=register`

## Important Test Environment Note (No Mock Values)
The test runner reaches SaaS over HTTP (`http://service-gen-saas:3000`) inside the Docker network.
Home-page auth URL generation uses PKCE (`crypto.subtle`), which is not available in insecure HTTP contexts.

To keep the test real for **realm/client/redirect URL contract** while running in local Docker HTTP:
- the test injects a minimal `crypto.subtle.digest` implementation in the browser context **only**
- no realm/client/redirect values are mocked
- the URL generated is the real URL from the running SaaS app and live env config

## Commands Run (Docker)
- Recreate SaaS app after env changes:
  - `docker compose -f docker-compose.generated.yml up -d --force-recreate service-gen-saas`
- Keycloak realm inspection/update via `kcadm.sh` in `sg_keycloak`
- Playwright test run:
  - `docker exec playwright-test sh -lc 'cd /work && export NODE_PATH=$(npm root -g) && playwright test tests/e2e/home-auth-redirects.spec.ts --workers=1 --reporter=line'`

## Final Validation Result
- `home-auth-redirects.spec.ts`: `2 passed`

This confirms the *actual* home-page `Sign In` / `Sign Up` buttons now generate the correct Keycloak URLs against the live SaaS runtime configuration.
