# Architecture: Multi-Type Ingestion Orchestration

## Overview
The Knowledge Base Ingestion capability is being refactored to support a scalable, workflow-driven architecture. This design enables the system to handle diverse data sources (files, URLs, SaaS connectors) via specialized logic while maintaining a unified entry point.

## Components

### 1. Ingest API (`api.py`)
- Responsible for HTTP request handling.
- Accepts a **Bulk Request**: A structured multipart payload containing a `metadata` JSON (representing multiple sources) and a flattened list of `files`.
- Validates the presence of required fields.

### 2. Ingest Handler (`handler.py`)
- Parses the `metadata` JSON into a list of source objects.
- Acts as the entry point for the business logic.
- Delegates the entire batch to the `IngestWorkflowOrchestrator`.

### 3. Ingest Workflow Orchestrator (`workflow.py`)
- **Batch Processing**: Iterates through the list of sources.
- **Type-Based Routing**: Dynamically resolves the specific workflow implementation (from `workflows/`) for each source entry.
- **Context Management**: Passes the corresponding `UploadFile` objects to the `FileIngestWorkflow` by matching filenames.
- **Result Aggregation**: Collects success/failure status for each individual source in the batch.

### 4. Specialized Workflows (`workflows/*.py`)
- Implements the specific logic for a source type.
- `FileIngestWorkflow`: Handles MinIO uploads and document metadata indexing.
- `UrlIngestWorkflow`: Handles scraping, link extraction, and indexing.

### 5. Ingest Tasks (`tasks.py`)
- Provide atomic, reusable operations.
- `upload_to_minio`: Low-level MinIO client interaction.
- `save_source_metadata`: Database persistence for source records.

## Sequence Diagram

```mermaid
sequenceDiagram
    participant U as User/Frontend
    participant A as api.py
    participant H as handler.py
    participant W as workflow.py
    participant SW as workflows/*.py
    participant T as tasks.py

    U->>A: POST /data-sources (Multipart)
    A->>H: handle_ingestion(service_id, metadata, files)
    loop For each source in metadata
        H->>W: process_source(tenant_id, service_id, source, files)
        W->>SW: execute(tenant_id, service_id, source, files)
        SW->>T: upload/save operations
        T-->>SW: success
        SW-->>W: SourceResult
    end
    W-->>H: List[SourceResult]
    H-->>A: UnifiedResponse
    A-->>U: JSON(Success)
## Unified Response Structure
The API returns an `IngestResponse` containing a summary and a detailed list of results:
```json
{
  "status": "partial_success | success | failure",
  "message": "Processed 5 sources...",
  "results": [
    {
      "source_id": "uuid",
      "type": "file",
      "status": "success",
      "details": { "path": "tenant/org/service/file.pdf" }
    },
    {
      "source_id": "uuid",
      "type": "url",
      "status": "failed",
      "error": "Connection timeout"
    }
  ]
}
```
