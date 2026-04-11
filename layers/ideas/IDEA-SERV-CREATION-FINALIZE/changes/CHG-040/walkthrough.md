# CHG-040 Walkthrough

## Scope
This run addresses the remaining issue where assistant text appeared as a blob instead of visibly streaming.

Architecture preserved:
- UI -> Next.js server-side -> service-gen-api -> streamed response -> Next.js server -> UI.

## Root findings
1. Wrapper route (`/v1/language-model`) was previously building a full response first and then emitting quickly.
2. Stream source flow emitted a single full chunk (`yield result`), so no natural incremental token cadence.
3. Prompt extraction helper had a slicing bug (`history[-1:1]`) reducing context extraction quality.

## Changes implemented

### 1) Incremental server-side chunk streaming in flow
- File: `capabilities/chatbot/handle_request/workflow.py`
- Updated `handle_chat_completions_flow(...)`:
  - after response generation, splits text into word-like chunks (`\S+\s*`)
  - yields chunk-by-chunk with short pacing (`await asyncio.sleep(0.015)`) for visible incremental updates.

### 2) Wrapper route streams directly from completion flow
- File: `capabilities/chatbot/handle_request/api.py`
- Updated `@router.post("/v1/language-model")`:
  - stream path now iterates `handle_chat_completions_flow(...)` and emits `text-delta` per chunk.
  - keeps `text-start`, `text-end`, `finish`, `[DONE]` events.
  - realm IDs (`service_id`, `tenant_id`, `org_id`) taken from body/headers and forwarded.
- non-stream path remains fast by using `handle_chat_flow(...)` directly.

### 3) Fixed prompt extraction bug
- File: `capabilities/chatbot/handle_request/api.py`
- `extract_text_from_prompt(...)` fixed from `history[-1:1]` to `history[-2:]`.

## Prior bridge alignment retained
- Next.js bridge remains aligned to wrapper protocol:
  - `ui-apps/service-gen-ai-chatbot/app/(chat)/api/chat/route.ts`
  - accepts wrapper `text-delta` and OpenAI fallback chunks.

## Verification
- Python compile checks passed for modified backend files.
- `service-gen-api` restarted.
- In-container live check of `/v1/language-model` showed:
  - immediate `text-start`
  - then incremental `text-delta` lines over time (not single blob).

## Requested output: services list/get from DB
- Backend implementation:
  - `capabilities/service/caps/create_service/api.py`
  - `list_services()` -> DB query on `Service` by tenant, ordered by newest, serialized via `_serialize_service(...)`.
  - `get_service(service_id)` -> DB query by id+tenant, serialized via `_serialize_service(...)`.
- Frontend usage:
  - `ui-apps/service-gen-saas/app/dashboard/services/page.tsx`
  - fetches `ROUTES.SERVICE_LIST` and renders database-backed results.

