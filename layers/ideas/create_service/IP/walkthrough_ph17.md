# Create Service - Phase 17 Walkthrough (Modify Flow Harmonization)

## Objective
Align modify-service with the create-service wizard UX and behavior, while preserving existing route entrypoints and validating persistence with real e2e tests.

## Implemented Changes

1. Modify entry route now bootstraps wizard context
- File: `ui-apps/service-gen-saas/app/dashboard/services/modify/[id]/page.tsx`
- Behavior:
  - Stores `sg_service_id` in session storage from route param.
  - Redirects to create wizard route with modify mode:
    - `/dashboard/services/new?mode=modify&service_id=<id>`

2. Create wizard now supports modify-mode preload and real updates
- File: `ui-apps/service-gen-saas/app/dashboard/services/new/page.tsx`
- Added:
  - `useSearchParams()` parsing:
    - `mode=modify`
    - `service_id`
  - Modify bootstrap effect:
    - loads service details via API
    - sets `serviceId`, `chatbotId`
    - preloads step state (`serviceName`, `department`, `description`, `botName`, `prompt`, `dataSources`, `channels`)
- Updated step-save semantics for existing entities:
  - Step 1 with existing `serviceId` now calls `PUT /api/service/v1/services/{id}`
  - Step 2 with existing `chatbotId` now calls `PUT /api/service/v1/services/{serviceId}/chatbot/{chatbotId}`
- UI label updates in modify mode:
  - Header: `Modify service`
  - Final action: `Finish & Redeploy`

3. Services list modify-action test aligned to new navigation shape
- File: `ui-apps/service-gen-saas/tests/e2e/services-list-actions-and-status.spec.ts`
- Modify-action URL assertion now accepts both:
  - `/dashboard/services/modify/{id}`
  - `/dashboard/services/new?mode=modify&service_id={id}`

4. New e2e: real modify persistence flow (artifact-based)
- File: `ui-apps/service-gen-saas/tests/e2e/modify-service-flow.spec.ts`
- Test coverage:
  - get/create scoped service artifact
  - open modify flow
  - verify preload
  - update step 1 fields and step 2 prompt
  - advance to step 3
  - poll backend service details until updates are persisted

5. Auth helper hardened for redirect-interrupt flake
- File: `ui-apps/service-gen-saas/tests/e2e/helpers/auth.ts`
- `gotoWithAbortRetry` now handles both:
  - `net::ERR_ABORTED`
  - `Navigation ... interrupted by another navigation`
- Continues safely when redirect already moved to auth/dashboard.

## Validation Run

### Modify flow spec
```bash
docker compose -f docker-compose.generated.yml exec -T playwright-test sh -lc \
  'cd /work && ./node_modules/.bin/playwright test tests/e2e/modify-service-flow.spec.ts --workers=1 --reporter=line --timeout=180000 --global-timeout=900000'
```
Result: `1 passed`

### Services list/actions/status spec
```bash
docker compose -f docker-compose.generated.yml exec -T playwright-test sh -lc \
  'cd /work && ./node_modules/.bin/playwright test tests/e2e/services-list-actions-and-status.spec.ts --workers=1 --reporter=line --timeout=180000 --global-timeout=1200000'
```
Result: `7 passed`

## Outcome
- Modify route now uses the same wizard UI and workflow surface as create-service.
- Existing service/chatbot data is preloaded in modify mode.
- Step-level updates are persisted through backend API updates.
- E2E validation for modify persistence and services-list actions is passing.
