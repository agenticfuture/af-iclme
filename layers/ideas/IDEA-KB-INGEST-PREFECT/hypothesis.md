# Hypothesis: Traceable Prefect Orchestration

By wrapping the ingestion workflows in Prefect `@flow` and `@task` decorators, we gain:
1.  **Visibility**: Real-time monitoring of ingestion status.
2.  **Traceability**: Clear logs and state transitions for each data source.
3.  **Resilience**: Native support for retries on flaky network operations (like MinIO uploads or URL scraping).
4.  **Auditability**: Historical record of all ingestion runs.

## Proposed Strategy
- **Core Orchestrator**: `workflow.py` defines the main `entrypoint_flow`.
- **Source Workflows**: Sub-flows for each data type (file, url).
- **Atomic Tasks**: Low-level operations in `tasks.py` wrapped as `@task`.
