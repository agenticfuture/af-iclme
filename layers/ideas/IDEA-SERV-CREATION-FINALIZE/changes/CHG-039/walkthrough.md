# CHG-039 Walkthrough

## Scope
This run fixes stream mismatch by aligning the Next.js chatbot bridge with the service-gen wrapper endpoint protocol while preserving architecture:
- UI -> Next.js server-side -> service-gen-api -> streamed response -> Next.js server -> UI.

## Root issue
- Next.js `/api/chat` bridge was primarily parsing OpenAI-style chunks from `/v1/chat/completions`.
- Backend wrapper `/v1/language-model` emits Vercel-style events (`text-start`, `text-delta`, `text-end`, `finish`, `[DONE]`).
- Protocol mismatch caused inconsistent/rough stream behavior in UI.

## Changes implemented

1. Backend wrapper cleaned and realm-aware
- File: `capabilities/chatbot/handle_request/api.py`
- Endpoint: `@router.post("/v1/language-model")`
- Changes:
  - Removed hardcoded service id (`"id"`) and now resolves realm from body/headers:
    - `service_id`, `tenant_id`, `org_id`
  - Kept non-stream and stream responses.
  - Streaming emits proper SSE v1 style events with `text-start`, iterative `text-delta`, `text-end`, `finish`, and `[DONE]`.
  - Removed artificial delays that degraded perceived quality.

2. Next.js bridge switched to wrapper endpoint and dual-protocol parse
- File: `ui-apps/service-gen-ai-chatbot/app/(chat)/api/chat/route.ts`
- Changes:
  - Upstream route switched to `SERVICE_GEN_ROUTES.LANGUAGE_MODEL`.
  - Body switched to wrapper-compatible payload:
    - `prompt: [{ role: 'user', content: [{ type: 'text', text: ... }] }]`
  - Parser now handles both:
    - wrapper events (`type: text-delta`)
    - OpenAI chunks (`choices[0].delta.content`) as fallback
  - Wrapper deltas are emitted immediately to UI stream (after flush of pending buffer).

3. Shared route constants updated
- File: `ui-apps/service-gen-ai-chatbot/lib/servicegen-config.ts`
- Added:
  - `LANGUAGE_MODEL: "/v1/language-model"`

## Runtime apply/verification
- Restarted services:
  - `service-gen-api`
  - `service-gen-ai-chatbot`
- Validated wrapper stream in-container (`service-gen-api`, localhost):
  - HTTP 200
  - stream output contains expected sequence starting with:
    - `data: {"type": "text-start", ...}`
    - multiple `data: {"type": "text-delta", ...}`

## Requested output: DB-backed services list/get
- Backend DB query source:
  - `capabilities/service/caps/create_service/api.py`
  - `list_services()` -> queries `Service` table by tenant, ordered by `created_at desc`, serialized via `_serialize_service(...)`
  - `get_service(service_id)` -> queries one service by `id` + tenant and serializes via `_serialize_service(...)`
- Frontend consumption:
  - `ui-apps/service-gen-saas/app/dashboard/services/page.tsx`
  - fetches `ROUTES.SERVICE_LIST` and renders API-backed service list.

## Architecture confirmation
- No architectural deviation was introduced.
- Flow remains exactly:
  - UI -> Next.js server-side -> service-gen-api -> streamed response -> Next.js server -> UI.

