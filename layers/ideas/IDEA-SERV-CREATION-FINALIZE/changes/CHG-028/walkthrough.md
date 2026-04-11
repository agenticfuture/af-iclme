# Walkthrough - Modify Flow + Lifecycle Status + Bot Route Alignment (CHG-028)

## Scope Delivered
1. Replaced service details settings icon with a modify icon and route.
2. Added a separate modify flow under services folder (not mixed into create flow).
3. Implemented step-wise load/save update behavior and redeploy on finish.
4. Added lifecycle actions: unpublish bot, deactivate service, archive service.
5. Re-aligned playground/embed/widget iframe loading to bot app container routes.

## Backend Changes
- File: `capabilities/service/caps/create_service/api.py`
- Added update and lifecycle endpoints:
  - `PUT /api/service/v1/services/{service_id}`
  - `PUT /api/service/v1/services/{service_id}/chatbot/{chatbot_id}`
  - `PUT /api/service/v1/services/{service_id}/data-sources`
  - `PUT /api/service/v1/services/{service_id}/channels`
  - `POST /api/service/v1/services/{service_id}/unpublish`
  - `POST /api/service/v1/services/{service_id}/status`
- Enriched service serialization with:
  - `service_status`, `bot_status`, `prompt`.

## Frontend Changes
- Details page icon + route:
  - `ui-apps/service-gen-saas/app/dashboard/services/[id]/page.tsx`
  - Settings icon replaced by pencil icon.
  - Route now points to `/dashboard/services/modify/{id}`.

- New lifecycle actions component:
  - `ui-apps/service-gen-saas/components/service-status-actions.tsx`
  - Actions call DB-backed APIs:
    - Unpublish bot
    - Deactivate service
    - Archive service

- New modify flow (separate from create):
  - `ui-apps/service-gen-saas/app/dashboard/services/modify/[id]/actions.ts`
  - `ui-apps/service-gen-saas/app/dashboard/services/modify/[id]/page.tsx`
  - Progressive step loading, save on each `Next`, redeploy on `Finish`.

- Bot iframe/embed alignment updates:
  - `ui-apps/service-gen-saas/components/chatbot-embed.tsx`
  - `ui-apps/service-gen-saas/app/dashboard/services/[id]/success/page.tsx`
  - `ui-apps/service-gen-ai-chatbot/app/widget.js/route.ts`
  - iframe route usage standardized to `/iframe/{serviceId}` on `bot.servicegen.local`.

## Validation Notes
- Python syntax compile check for modified backend file passed via in-memory compile.
- `py_compile` file-cache path was sandbox-restricted in this environment.
