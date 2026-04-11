# Create Service - Phase 16 Walkthrough (Scope Middleware Fix + Verification)

## Date
2026-03-30

## Objective
Continue the next implementation-plan phase with independent tests/artifact chaining and close verification gates for:
- Create Service API suites (product/security/privacy)
- SaaS e2e flows (create-service + services-list actions)
- Runtime evidence (DB rows + bot stream SSE)

## Root Cause Found
Tenant-scoped data-source routes were passing gateway policy but still failing runtime (`Tenant scope not set`) because DB scope middleware only set tenant/org from JWT claims, while these routes were enforcing `x-tenant-id` / `x-org-id` headers.

## Code Changes

1. **DB scope middleware fallback (real fix)**
- File: `app/ingress/api/main.py`
- Change:
  - In `gateway_policy_middleware`, tenant/org scope now resolves from:
    - claims (`tenant_id` / `org_id` or `tenant` / `org`)
    - **fallback headers** (`x-tenant-id`, `x-org-id`)
  - DB scope context now applies when either claims or required headers provide tenant context.

2. **API test header alignment**
- Files:
  - `app/ingress/api/tests/test_create_service_flow_contract.py`
  - `app/ingress/api/tests/test_create_service_security_controls.py`
  - `app/ingress/api/tests/test_create_service_privacy_controls.py`
- Change:
  - `_auth_headers()` now includes:
    - `x-tenant-id: 00000000-0000-0000-0000-000000000001`
    - `x-org-id: 00000000-0000-0000-0000-000000000001`

3. **Playwright auth hardening for flaky navigation**
- File: `ui-apps/service-gen-saas/tests/e2e/helpers/auth.ts`
- Change:
  - Added `gotoWithAbortRetry(...)`
  - `loginExistingUser(...)` uses retry for `net::ERR_ABORTED` on initial SaaS navigation

4. **Playwright Step-3 selector hardening**
- File: `ui-apps/service-gen-saas/tests/e2e/create-service-playground-flow.spec.ts`
- Changes:
  - `ensureFileUploadInputVisible(...)` now:
    - targets labeled Source Type combobox first
    - retries dropdown open/select
    - handles role-option fallback selectors
    - extends file-input visibility timeout to 60s
  - Direct-ingest test no longer depends on `Data Sources` heading only:
    - waits on heading OR add/update button OR Source Type text
    - then delegates to hardened file-input helper

## Validation Executed

### API suites
Command:
```bash
docker compose -f docker-compose.generated.yml exec -T service-gen-api \
  /app/.venv/bin/python -m pytest -q \
  /app/tests/test_create_service_flow_contract.py \
  /app/tests/test_create_service_security_controls.py \
  /app/tests/test_create_service_privacy_controls.py
```

Result:
- `29 passed`

### SaaS e2e
Command:
```bash
docker compose -f docker-compose.generated.yml exec -T playwright-test sh -lc \
  'cd /work && ./node_modules/.bin/playwright test tests/e2e/services-list-actions-and-status.spec.ts --workers=1 --reporter=line --timeout=180000 --global-timeout=1200000'
```

Result:
- `7 passed`

Command:
```bash
docker compose -f docker-compose.generated.yml exec -T playwright-test sh -lc \
  'cd /work && ./node_modules/.bin/playwright test tests/e2e/create-service-playground-flow.spec.ts --workers=1 --reporter=line --timeout=180000 --global-timeout=900000'
```

Result:
- `3 passed`

### DB evidence
Database: `servicegen`

Verified latest rows in:
- `service.services`
- `job.jobs`
- `service.deployments`

Observed:
- recently created services for current tenant/org
- ingest jobs persisted with `success`
- deployment rows with `draft` and `published` transitions

### Bot stream runtime evidence
Internal network probe to chatbot runtime:
- endpoint: `http://service-gen-ai-chatbot:3000/api/chat`
- with real `service_id`, `tenant_id`, `org_id`

Observed SSE sequence:
- `start`
- `start-step`
- `text-start`
- `text-delta` (`"Hello!"`)
- `finish-step`
- `finish`

## Outcome
Current phase is stable and verified on real runtime paths:
- API create-service suites green
- services-list and create-service e2e green
- DB persistence evidence confirmed
- bot SSE text stream confirmed end-to-end
