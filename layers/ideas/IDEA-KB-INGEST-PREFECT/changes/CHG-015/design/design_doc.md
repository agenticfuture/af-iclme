# Design Doc: Prefect Ingest Orchestration

## 1. Traceability Standard
- All flows must have descriptive names (e.g., `Ingest: {source_id}`).
- All tasks must include retries for network-bound operations.

## 2. Prefect Integration Components

### IngestWorkflowOrchestrator
- `process_bulk()`: The master flow.
- Maps `UploadFile` objects to source metadata.

### BaseIngestWorkflow
- `execute()`: Abstract method, but child implementations will be `@flow`.

### IngestTasks
- `upload_files_to_minio()`: `@task(retries=3, retry_delay_seconds=5)`.

## 3. Configuration
- Prefect API URL and token managed via environment variables.
- Uses the local Prefect server by default (docker service `prefect`).

## 4. Error Handling
- Prefect's state management will catch uncaught exceptions and mark flows as `Failed`.
- The handler will return the aggregated results summarized from the flow run metadata.
