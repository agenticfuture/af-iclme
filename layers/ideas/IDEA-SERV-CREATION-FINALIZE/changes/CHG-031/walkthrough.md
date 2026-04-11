# Walkthrough - Realm-Scoped Embeddings and Chat Retrieval Wiring (CHG-031)

## Objective
Ensure embeddings storage/search and chatbot retrieval are fully scoped by `(tenant_id, org_id, service_id)`, and that ingestion of uploaded files embeds data correctly for newly created services.

## Implemented
1. Realm collection utility:
- Added `capabilities/utils/realm.py` with `qdrant_realm_collection_name(tenant_id, org_id, service_id)` for consistent collection naming.

2. Qdrant search filter now enforces full realm:
- Updated `capabilities/utils/qdrant_store.py`:
  - `search_qdrant(...)` now filters by `tenant_id`, `org_id`, and `service_id`.
  - `search_embeddings(...)` also filters by `tenant_id`, `org_id`, and `service_id`.

3. `embeddings.search_qdrant` capability updated:
- `capabilities/embeddings/search_qdrant/entities.py` now requires `tenant_id`, `org_id`, `service_id` and supports optional `collection`.
- `capabilities/embeddings/search_qdrant/workflow.py` removed hardcoded tenant/collection and now uses realm-derived collection by default.
- `capabilities/embeddings/search_qdrant/api.py` now serializes Qdrant points into JSON-safe response payload.
- Updated local runner example in `capabilities/embeddings/search_qdrant/main.py`.

4. `embeddings.embed_store_qdrant` capability repaired and realm-enabled:
- Replaced broken API/entities/workflow with clean implementation:
  - `capabilities/embeddings/embed_store_qdrant/entities.py`
  - `capabilities/embeddings/embed_store_qdrant/workflow.py`
  - `capabilities/embeddings/embed_store_qdrant/api.py`
  - `capabilities/embeddings/embed_store_qdrant/handler.py`
  - `capabilities/embeddings/embed_store_qdrant/main.py`
- Embedding metadata now includes `tenant_id`, `org_id`, `service_id`, `source`, and `source_type`.
- Collection defaults to realm collection when not explicitly provided.

5. Chatbot `handle_request` flow now forwards realm into retrieval:
- Updated:
  - `capabilities/chatbot/handle_request/entities.py`
  - `capabilities/chatbot/handle_request/workflow.py`
  - `capabilities/chatbot/handle_request/handler.py`
  - `capabilities/chatbot/handle_request/api.py`
- `/v1/chat/completions` now passes `tenant_id`, `org_id`, `service_id` through to retrieval flow.
- Retrieval step now builds `EmbeddingSearchRequest` with full realm and returns empty context when realm is missing.

6. Knowledge-base file ingestion now actually embeds uploaded files:
- Replaced `capabilities/knowledge_base/caps/ingest/workflows/file.py` logic:
  - Uploads files to MinIO.
  - Extracts text per file (`.txt/.md/.docx`, optional `.pdf` if `pypdf` installed).
  - Chunks text, generates embeddings, stores vectors in realm-scoped Qdrant collection.
  - Stores realm metadata on each chunk payload.

7. Ingest API realm resolution from service record:
- Updated `capabilities/knowledge_base/caps/ingest/api.py`:
  - Resolves `tenant_id` and `org_id` from DB using `service_id`.
  - Removes hardcoded tenant/org.
  - URL ingest now accepts `{ "urls": [...] }`.

8. Deployment URL realm alignment:
- Updated `capabilities/service/caps/create_service/tasks.py` deployment URL to:
  - `https://bot.servicegen.local/chat?embed=1&service_id=...&tenant_id=...&org_id=...`

## Verification
- Python syntax check executed successfully with:
  - `PYTHONPYCACHEPREFIX=/tmp/pycache python3 -m py_compile ...` (changed backend files)

## Tracking
- Prompt copy saved:
  - `af-iclme/execution-plans/already_run/35_exe_plan_template_prompt.md`
- Walkthrough saved:
  - `af-iclme/layers/ideas/IDEA-SERV-CREATION-FINALIZE/changes/CHG-031/walkthrough.md`
