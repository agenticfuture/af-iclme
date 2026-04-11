# Walkthrough PH18 - Embed Runtime Standardization + Scoped Token Hardening

## Objective
Implement standardized embed runtime behavior for SaaS snippets (widget/iframe/react), enforce signed scope token usage, add dedicated embed test host app, and verify with executable tests.

## Changes Implemented

### 1) Implementation Plan Update
- Added `implementation_plan_v1.2.0.md` with:
  - `Phase 6 (Embed Runtime Standardization)`
  - updated verification and exit criteria for standardized snippets and dedicated embed-test app.

### 2) Shared Embed Runtime (Single Source of Truth)
- Added:
  - `ui-apps/service-gen-saas/lib/embed/runtime-snippets.ts`
- Provides:
  - `buildWidgetEmbedSnippet`
  - `buildIframeEmbedSnippet`
  - `buildReactEmbedSnippet`
- Runtime behavior:
  - self-contained script
  - shadow DOM style isolation
  - floating launcher + panel UX
  - availability gating via `/api/service/v1/embed/availability`
  - periodic re-check and auto-hide when disallowed/unpaid
  - signed scope token propagation (`sg_scope_token`).

### 3) SaaS Integration Refactor
- Updated:
  - `ui-apps/service-gen-saas/components/chatbot-embed.tsx`
  - `ui-apps/service-gen-saas/app/dashboard/services/[id]/page.tsx`
  - `ui-apps/service-gen-saas/app/dashboard/services/[id]/success/page.tsx`
- Result:
  - snippet outputs now generated from shared runtime helpers instead of duplicated ad-hoc scripts.

### 4) Dedicated Embed Test App
- Added:
  - `ui-apps/chatbot-embed-test/index.html`
  - `ui-apps/chatbot-embed-test/README.md`
- Purpose:
  - simulate tenant host website
  - validate widget independence from host CSS/JS.

### 5) Token + Scope Work Already Integrated in Current Stream
- Existing additions used by this phase:
  - signed scope token generation route:
    - `ui-apps/service-gen-saas/app/api/embed/scope-token/route.ts`
  - signed token helpers:
    - `ui-apps/service-gen-saas/lib/embed/scope-token.ts`
    - `ui-apps/service-gen-ai-chatbot/lib/embed/scope-token.ts`
  - strict bot scope verification + scoped DB persistence:
    - `ui-apps/service-gen-ai-chatbot/app/(chat)/api/chat/route.ts`
    - `ui-apps/service-gen-ai-chatbot/lib/db/schema.ts`
    - `ui-apps/service-gen-ai-chatbot/lib/db/migrations/0008_polite_scope_columns.sql`.

## Verification Executed

### Passed
1. Chatbot DB migration:
   - `pnpm db:migrate` in `service-gen-ai-chatbot` container
   - migration completed successfully.
2. Chatbot typecheck:
   - `pnpm typecheck` in `service-gen-ai-chatbot` container
   - passed.
3. Embed runtime contract test:
   - `pnpm exec tsx scripts/test-embed-runtime-contract.ts` in `service-gen-saas` container
   - passed (`embed-runtime-contract: ok`).

### Post-restart stabilization and e2e closure (latest)
1. Full stack restart executed:
   - `docker compose -f docker-compose.generated.yml down`
   - `docker compose -f docker-compose.generated.yml up -d`
2. API readiness blocker fixed:
   - API container had missing venv deps after restart (`ModuleNotFoundError: fastapi`)
   - fixed with `/app/.venv/bin/uv sync` inside `service-gen-api`, then restarted API.
3. Added Traefik DNS alias for host test app:
   - `embed-test.servicegen.local` under `traefik` network aliases in `docker-compose.generated.yml`.
4. Host embed test stabilized:
   - updated `ui-apps/service-gen-saas/tests/e2e/embed-host-widget.spec.ts` to:
     - fetch scope token from `/api/embed/scope-token` (auth session + API contract) instead of parsing UI snippet text,
     - follow valid service/deployment transitions with idempotent conflict handling,
     - retry transient `5xx` deployment status updates.
5. Added inline mode verification:
   - same spec now validates `mode=inline` behavior on `embed-test.servicegen.local`.
6. Runtime standardization spec aligned to new snippet format:
   - updated `embed-runtime-standardization.spec.ts` assertions from legacy `sg_scope_token=` literal to `scopeToken`.

### Latest e2e command/evidence set (green)
- `pnpm exec playwright test tests/e2e/auth.setup.spec.ts --reporter=list --workers=1`
  - passed
- `pnpm exec playwright test tests/e2e/embed-availability-policy.spec.ts tests/e2e/embed-host-widget.spec.ts --reporter=list --workers=1`
  - passed
- `pnpm exec playwright test tests/e2e/embed-runtime-standardization.spec.ts --reporter=list --workers=1`
  - passed
- `pnpm exec playwright test tests/e2e/embed-host-widget.spec.ts --grep "inline mode" --reporter=list --workers=1`
  - passed

## Outcome
- Shared runtime standard is implemented and wired into SaaS embed outputs.
- Signed token and availability gating are integrated into runtime generation.
- Dedicated embed test host app exists for real copy/paste validation.
- Core contract verification and browser e2e verification are both passing in the current stack.
