# CHG-041 Walkthrough

## Scope
This run fixes the active streaming blocker where `service-gen-api` emitted `httpx.ConnectError`/Prefect stack traces and frontend streaming degraded.

Architecture preserved:
- UI -> Next.js server-side -> service-gen-api -> streamed response -> Next.js server -> UI.

## Root cause
The live chatbot streaming path still executed Prefect-decorated functions (`@flow`/`@task`) in `capabilities/chatbot/handle_request/workflow.py`.
When Prefect API/block storage was unavailable, stream generation failed before stable token output.

## Changes implemented

### 1) De-prefect the live chatbot workflow path
- File: `capabilities/chatbot/handle_request/workflow.py`
- Removed Prefect decorators/import from runtime path:
  - removed `from prefect import flow, task`
  - removed `@flow` from `handle_chat_flow`, `handle_chat_completions_flow`
  - removed `@task` from helper functions (`generate_trace_id`, `apply_privacy`, `apply_guardrails`, `retrieve_context`, `generate_with_crew`)
- Effect: stream path no longer depends on Prefect orchestration availability.

### 2) Fix stream proxy parsing and pass-through behavior
- File: `ui-apps/service-gen-ai-chatbot/app/(chat)/api/chat/route.ts`
- Removed buffered/pending chunk coalescing that could delay rendering.
- Emit `text-delta` immediately for both wrapper-style and OpenAI-style chunks.
- Stop swallowing upstream error events (`type=error`) by malformed-chunk catch blocks; now these raise properly.
- Effect: smoother incremental rendering and clearer failure propagation.

### 3) Add missing structured error helper
- File: `capabilities/chatbot/handle_request/api.py`
- Added `structured_error(...)` wrapper used by `/v1/language-model` validation paths.

## Verification
- Parsed/compiled updated Python files successfully (`compile(..., 'exec')` check).
- Restarted `service-gen-api` and `service-gen-ai-chatbot` containers.
- Verified live container file has no Prefect decorators in chatbot workflow.
- Ran in-container request to `/v1/language-model`; observed incremental events:
  - `text-start`
  - multiple `text-delta` lines (`"Hello! "`, `"How "`, `"can "`, ...)
- Recent logs after test show no new Prefect connect stack for this request path.

## Notes
- Retrieval currently falls back gracefully when Qdrant collection is missing (404); chat still streams.
- This change does not alter the required chatbot architecture or move logic outside the existing path.

## Services list/get DB output (requested)
- Backend service list/get is DB-backed in:
  - `capabilities/service/caps/create_service/api.py`
  - `list_services()` queries `Service` by tenant and serializes via `_serialize_service(...)`.
  - `get_service(service_id)` queries by id+tenant and serializes via `_serialize_service(...)`.
- Frontend consumption:
  - `ui-apps/service-gen-saas/app/dashboard/services/page.tsx` calls `ROUTES.SERVICE_LIST` and renders returned DB records.
