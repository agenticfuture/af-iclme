# CHG-042 Walkthrough

## Scope
This run enforces Prefect orchestration presence in chatbot workflows while keeping stream quality and resilience.

Architecture preserved:
- UI -> Next.js server-side -> service-gen-api -> streamed response -> Next.js server -> UI.

## Changes implemented

### 1) Restored Prefect orchestrator decorators in workflow
- File: `capabilities/chatbot/handle_request/workflow.py`
- Reintroduced:
  - `from prefect import flow, task`
  - `@task` on unit operations (`generate_trace_id`, `apply_privacy`, `apply_guardrails`, `retrieve_context`, `generate_with_crew`)
  - `@flow` on `handle_chat_flow`
  - `@flow(name="AI-chatbot-streaming-resp")` on `handle_chat_completions_flow`
- Added internal raw helpers (`_...`) plus runtime variants to preserve service continuity in case Prefect endpoint is unstable.

### 2) Added API-level Prefect fallback wrappers (without changing architecture)
- File: `capabilities/chatbot/handle_request/api.py`
- Added:
  - `run_chat_flow_with_fallback(...)`
  - `iter_chat_chunks_with_fallback(...)`
- Behavior:
  - Prefer Prefect-decorated flows for traceability.
  - On Prefect-side failure, fallback to runtime implementation to keep user stream alive.

### 3) Stream protocol behavior retained and validated
- Next.js bridge remains progressive (`text-delta` pass-through) from prior fix:
  - `ui-apps/service-gen-ai-chatbot/app/(chat)/api/chat/route.ts`

## Verification
- Python parse/compile checks passed for modified backend files.
- Restarted containers:
  - `service-gen-api`
  - `service-gen-ai-chatbot`
- Live stream probe to `/v1/language-model` emitted incremental chunks:
  - `text-start`
  - multiple `text-delta` values (`"Hello "`, `"again! "`, `"How "`, ...)
  - `text-end`
- Logs confirm Prefect orchestration is active:
  - flow run created for `AI-chatbot-streaming-resp`.

## Requested output: how services list/get are DB-backed
- Backend implementation:
  - `capabilities/service/caps/create_service/api.py`
  - `list_services()` returns DB records serialized with `_serialize_service(...)`.
  - `get_service(service_id)` loads one DB service by id and serializes via `_serialize_service(...)`.
- Frontend usage:
  - `ui-apps/service-gen-saas/app/dashboard/services/page.tsx`
