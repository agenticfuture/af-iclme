# Walkthrough - Use Existing Bot App Route (No Custom Embed/Iframe Pages) (CHG-029)

## Objective
Align playground/embed behavior with the existing bot app (`bot.servicegen.local`) instead of custom embed wrappers.

## Implemented
1. Removed custom bot pages/components introduced earlier:
- `ui-apps/service-gen-ai-chatbot/app/embed/[serviceId]/page.tsx`
- `ui-apps/service-gen-ai-chatbot/app/iframe/[serviceId]/page.tsx`
- `ui-apps/service-gen-ai-chatbot/app/widget.js/route.ts`
- `ui-apps/service-gen-ai-chatbot/components/service-embed-chat.tsx`

2. Real bot app route for embedding:
- Standardized embed target to `/chat` with realm query params:
  - `embed=1`
  - `service_id`
  - `tenant_id`
  - `org_id`

3. Realm context persistence + masking:
- Updated `proxy.ts` to persist realm context in cookies (`sg_service_id`, `sg_tenant_id`, `sg_org_id`, `sg_embed_mode`) from query params.
- Updated chat layouts to hide sidebar when `sg_embed_mode=1`.
- Removed visible Vercel deployment CTA from chat header.

4. Chat request routing updates:
- Updated `components/chat.tsx` to pass realm fields in every `/api/chat` request body.
- Updated `/app/(chat)/api/chat/route.ts` to proxy to `https://api.servicegen.local/v1/chat/completions` and stream back in UI message SSE format.
- Route reads realm context from request body with cookie fallback.

5. SaaS playground/embed code updates:
- Updated embed URLs to call `https://bot.servicegen.local/chat?...` instead of widget/iframe custom pages.
- Updated script mode to create a floating iframe directly (no `widget.js`).

## Tracking
- Prompt copy saved:
  - `af-iclme/execution-plans/already_run/33_exe_plan_template_prompt.md`
- Walkthrough saved:
  - `af-iclme/layers/ideas/IDEA-SERV-CREATION-FINALIZE/changes/CHG-029/walkthrough.md`
