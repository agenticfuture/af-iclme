# Walkthrough - Scoped Bot Playground + Real Services Listing (CHG-024)

## What Was Fixed
1. Playground 404 issue:
   - Added bot routes: `/embed/[serviceId]`, `/iframe/[serviceId]`, and `/widget.js` in the bot app.
   - Updated SaaS playground and embed components to use these routes.

2. Multi-tenant/service context scoping:
   - Added/propagated `service_id`, `tenant_id`, `org_id` through playground, widget config, embed URLs, and bot query requests.
   - Updated chatbot completion API to read these IDs from request body/headers and pass `service_id` into retrieval flow.

3. "View All Embed Options" updates:
   - Success page snippets now reference `bot.servicegen.local/widget.js` and `bot.servicegen.local/embed/{serviceId}` with scoped params.

4. Removed mock service listing:
   - Added backend endpoints to read services from DB.
   - Updated `/dashboard/services` and `/dashboard` to fetch live services from `/api/service/v1/services`.

## Files of Interest
- Backend:
  - `capabilities/service/caps/create_service/api.py`
  - `capabilities/chatbot/handle_request/api.py`
  - `capabilities/chatbot/handle_request/workflow.py`
  - `app/ingress/api/main.py`
- SaaS frontend:
  - `ui-apps/service-gen-saas/app/dashboard/services/page.tsx`
  - `ui-apps/service-gen-saas/app/dashboard/page.tsx`
  - `ui-apps/service-gen-saas/app/dashboard/services/[id]/playground/page.tsx`
  - `ui-apps/service-gen-saas/app/dashboard/services/[id]/success/page.tsx`
  - `ui-apps/service-gen-saas/components/chatbot-embed.tsx`
- Bot frontend:
  - `ui-apps/service-gen-ai-chatbot/components/service-embed-chat.tsx`
  - `ui-apps/service-gen-ai-chatbot/app/embed/[serviceId]/page.tsx`
  - `ui-apps/service-gen-ai-chatbot/app/iframe/[serviceId]/page.tsx`
  - `ui-apps/service-gen-ai-chatbot/app/widget.js/route.ts`

## Validation Notes
- Python compile checks on changed backend files passed.
- TypeScript checks in containers surfaced many pre-existing unrelated repository errors.

## Tracking
- Prompt copy saved to:
  - `af-iclme/execution-plans/already_run/28_exe_plan_template_prompt.md`
- Walkthrough saved to:
  - `af-iclme/layers/ideas/IDEA-SERV-CREATION-FINALIZE/changes/CHG-024/walkthrough.md`
