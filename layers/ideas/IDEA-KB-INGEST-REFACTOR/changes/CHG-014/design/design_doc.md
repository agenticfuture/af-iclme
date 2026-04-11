# Design Doc: Knowledge Base Ingest Refactor

## 1. Technical Goals
- Implement a type-based routing system for ingestion.
- Decouple source-specific logic from the main handler.
- Standardize the return format for all ingestion types.

## 2. Directory Structure
```text
capabilities/knowledge_base/caps/ingest/
├── api.py           # FastAPI Routes
├── handler.py       # Request Parser & Dispatcher
├── workflow.py      # Orchestrator & Factory
├── tasks.py         # Atomic Tasks (MinIO, DB)
└── workflows/       # Type-Specific Logic
    ├── __init__.py
    ├── base.py      # Abstract Base Class
    ├── file.py      # File Ingestion Logic
    └── url.py       # URL Ingestion Logic
```

## 3. Class Design

### IngestResult (Model)
- `source_id`: The ID from the frontend.
- `status`: String (success/failed).
- `error`: Optional error message.
- `data`: Optional success metadata (paths, hashes, etc.).

### IngestWorkflowOrchestrator
- `process_batch(tenant_id, service_id, sources, files)`: 
    - Maps `files` to `SourceConfig` where `type == 'file'`.
    - Parallelizes (or sequentially processes) individual workflows.
    - Aggregates `IngestResult` list.

## 4. Error Handling
- Each sub-workflow should return a standard `IngestResult` object containing status and error details per source.
- Partial failures (e.g., one file fails while others succeed) should be reported in the unified response.
