# Walkthrough - Centralized URLs/Routes + Local Bot DB Wiring (CHG-030)

## Objective
Enforce centralized route/base-URL usage via env-driven config, keep playground tied to `bot.servicegen.local/chat` with tenant/org/service realm context, and move chatbot DB migration/runtime from online DB to local postgres.

## Implemented
1. Centralized SaaS URL configuration:
- Added `ui-apps/service-gen-saas/lib/servicegen-config.ts` with:
  - `getServiceGenApiBaseUrl()`
  - `getServiceGenBotBaseUrl()`
  - `buildServiceGenApiUrl(path)`
- Added/extended centralized route constants in `ui-apps/service-gen-saas/shared/routes.ts` for service/bot/knowledge-base endpoints.

2. Refactored SaaS flow to use centralized config/routes:
- Updated API/bot URL calls in:
  - `ui-apps/service-gen-saas/app/dashboard/page.tsx`
  - `ui-apps/service-gen-saas/app/dashboard/services/page.tsx`
  - `ui-apps/service-gen-saas/app/dashboard/services/[id]/page.tsx`
  - `ui-apps/service-gen-saas/app/dashboard/services/[id]/playground/page.tsx`
  - `ui-apps/service-gen-saas/app/dashboard/services/[id]/success/page.tsx`
  - `ui-apps/service-gen-saas/app/dashboard/services/new/page.tsx`
  - `ui-apps/service-gen-saas/app/dashboard/services/modify/[id]/actions.ts`
  - `ui-apps/service-gen-saas/components/chatbot-embed.tsx`
  - `ui-apps/service-gen-saas/components/service-status-actions.tsx`
- Removed hardcoded API/bot host defaults from active flow files and used route builders for endpoint paths.

3. Bot app backend route centralization + realm flow preservation:
- Added `ui-apps/service-gen-ai-chatbot/lib/servicegen-config.ts` with env-driven API base + route constants.
- Updated `ui-apps/service-gen-ai-chatbot/app/(chat)/api/chat/route.ts` to call centralized API config route (`/v1/chat/completions`) while preserving tenant/org/service propagation and streaming behavior.

4. Local DB migration/runtime for bot app:
- Updated `ui-apps/service-gen-ai-chatbot/.env` from Neon values to local postgres (`postgres:postgres@postgres:5432/postgres`) and added:
  - `SERVICE_GEN_BASE_API=http://service-gen-api:8000`
  - `NEXT_PUBLIC_SERVICE_GEN_BASE_API=https://api.servicegen.local`
- Updated `ui-apps/service-gen-ai-chatbot/drizzle.config.ts` to load `.env` (same file used by compose/runtime).
- Updated `docker-compose.generated.yml` chatbot `depends_on` to include `postgres` and `service-gen-api`.
- Updated `ui-apps/service-gen-ai-chatbot/.env.example` with local postgres + ServiceGen base URL vars.

5. Metadata base URL env compliance:
- Updated `ui-apps/service-gen-ai-chatbot/app/layout.tsx` to read bot base URL from env variables instead of hardcoded host.

## Tracking
- Prompt copy saved:
  - `af-iclme/execution-plans/already_run/34_exe_plan_template_prompt.md`
- Walkthrough saved:
  - `af-iclme/layers/ideas/IDEA-SERV-CREATION-FINALIZE/changes/CHG-030/walkthrough.md`
