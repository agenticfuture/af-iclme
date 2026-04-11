# Phase 16 Walkthrough - Full Real Signup Callback Success + DB Save

## Objective
Close the remaining gap in the continuous real browser e2e path:
- SaaS `/register` -> real Keycloak registration UI -> SaaS callback success -> onboarding -> tenant registration DB persistence.

## Root Cause Found
The callback/auth fixes were largely correct, but the full-signup Playwright run still intermittently failed because:
- `service-gen-api` runs in dev mode with `watchfiles` reload on `/app`
- Playwright wrote artifacts under the shared repo (`ui-apps/service-gen-saas/test-results`)
- Those writes triggered API hot reload mid-test
- SaaS then saw `ECONNREFUSED` / `ECONNRESET` when calling `service-gen-api`

This was a runtime stability issue, not a remaining Keycloak redirect contract bug.

## Changes Made
### 1. Redirect Playwright outputs outside the shared repo
Updated `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-saas/playwright.config.ts`
- Added `outputDir: process.env.PLAYWRIGHT_OUTPUT_DIR || "test-results"`

### 2. Redirect full-signup test artifacts outside the shared repo
Updated `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-saas/tests/e2e/full-signup-to-db-save.spec.ts`
- Added `ARTIFACT_DIR` support via env (`PLAYWRIGHT_ARTIFACT_DIR` / `PLAYWRIGHT_OUTPUT_DIR`)
- Moved result/debug/screenshot paths to `join(ARTIFACT_DIR, ...)`
- `mkdirSync` now creates `ARTIFACT_DIR`

## Commands Executed
### Restart API to load latest auth callback debug patch
```bash
docker compose -f /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/docker-compose.generated.yml restart service-gen-api
```

### Run full real signup e2e with outputs redirected to `/tmp`
```bash
docker exec playwright-test sh -lc 'cd /work && export NODE_PATH=$(npm root -g) PLAYWRIGHT_OUTPUT_DIR=/tmp/pw-output PLAYWRIGHT_ARTIFACT_DIR=/tmp/pw-artifacts && timeout 480s playwright test tests/e2e/full-signup-to-db-save.spec.ts --reporter=line --workers=1 --output=/tmp/pw-output'
```
Result:
- `1 passed (2.0m)`

### Inspect successful run artifacts
```bash
docker exec playwright-test sh -lc 'cat /tmp/pw-artifacts/full-signup-to-db-save.debug.log && echo "---" && cat /tmp/pw-artifacts/full-signup-to-db-save.result.json'
```
Key proof lines:
- `saas_returned:https://saas.servicegen.local/dashboard`
- `onboarding_verify_loaded`
- `tenant_status:pending:EmailVerificationPending`

### Verify DB persistence for exact registration from successful run
```bash
docker exec postgres sh -lc "psql -U postgres -d servicegen -Atc \"SELECT r.id, r.status, r.current_state, r.tenant_id, t.status, u.status FROM tenant_reg.registration_requests r JOIN core.tenants t ON t.id = r.tenant_id JOIN core.users u ON u.tenant_id = r.tenant_id WHERE r.id = '604b1898-5b59-4b6d-aac4-d79a08c065c4';\""
```
Output:
- `604b1898-5b59-4b6d-aac4-d79a08c065c4|pending|EmailVerificationPending|4fa924be-3e89-434c-a6ea-98f35afdf1d3|provisioning|pending_verification`

## What Is Now Proven (Continuous Real Browser Path)
1. User clicks SaaS `Create Account` on `/register`
2. Browser lands on real Keycloak registration UI (`saas-servicegen` realm/client)
3. Registration form submits successfully
4. SaaS callback completes successfully and lands on `/dashboard` (not `/login?error=*`)
5. User proceeds to onboarding create page
6. Tenant registration API is called
7. Registration row is persisted in Postgres (`tenant_reg.registration_requests`)
8. Tenant/User projection rows exist in Postgres (`core.tenants`, `core.users`)

## Remaining Notes
1. Registration remains in `pending / EmailVerificationPending` after onboarding, which is expected for this flow until verification webhook/activation runs.
2. Dashboard UI still logs a services fetch error in local dev (`Failed to load dashboard services`) but this did not block auth callback or onboarding DB persistence proof.
