# CHG-037 Walkthrough

## Scope
This run addresses the reported failure:
- `prefect.exceptions.CancelledRun: The parent flow run was cancelled`
originating from `capabilities/embeddings/search_qdrant/handler.py` during chatbot retrieval.

The fix keeps the required streaming architecture intact:
- UI -> Next.js server-side -> service-gen-api -> streamed response -> Next.js server -> UI.

## Root cause
`handle_search` invoked `search_embeddings_flow(req)` (a Prefect flow) from within chatbot request processing. When parent/child flow lifecycle got cancelled, this propagated and broke retrieval path.

## Changes implemented

1. Switched search handler to non-flow runtime path
- File: `capabilities/embeddings/search_qdrant/handler.py`
- Before: `return search_embeddings_flow(req)`
- After: `return search_embeddings(req)`

2. Added plain function for synchronous retrieval execution
- File: `capabilities/embeddings/search_qdrant/workflow.py`
- Added: `search_embeddings(req)`
  - embeds query via `embed_query`
  - computes realm collection via `qdrant_realm_collection_name`
  - executes qdrant query via `search_qdrant`
- Kept Prefect `search_embeddings_flow` for optional orchestration, delegating to `search_embeddings`.

3. Hardened chatbot retrieval task against retrieval failures
- File: `capabilities/chatbot/handle_request/workflow.py`
- In `retrieve_context(...)`:
  - wrapped `handle_search(...)` in `try/except`
  - on exception logs warning and returns empty context instead of crashing stream pipeline.

## Why this is safe
- Does not alter chat transport contract or streaming boundaries.
- Does not alter realm filtering logic (tenant/org/service filters remain in qdrant query path).
- Removes nested Prefect-flow execution from the hot synchronous retrieval path.

## Verification
- Syntax check passed for modified files using `py_compile`.
- No change to Next.js/server stream routing behavior.

## Requested output: how service list is fetched from DB
- Backend list query:
  - File: `capabilities/service/caps/create_service/api.py`
  - Function: `list_services()`
  - Query: `db.query(Service).filter(Service.tenant_id == DEFAULT_TENANT_ID).order_by(Service.created_at.desc()).all()`
  - Serialization: `_serialize_service(...)` (includes chatbot/deployment/channels/config)
- Frontend usage:
  - File: `ui-apps/service-gen-saas/app/dashboard/services/page.tsx`
  - Calls `ROUTES.SERVICE_LIST` and renders returned services.

