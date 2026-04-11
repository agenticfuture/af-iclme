# Hypothesis: Modular Ingestion Workflows

By decoupling the ingestion logic into type-specific workflows and orchestrating them through a central `workflow.py`, we can:
1.  **Scalability**: Easily add new source types (Notion, Google Drive, etc.) by implementing a new workflow.
2.  **Clean Code**: Separate the concerns of HTTP handling, request parsing, and business process.
3.  **Advanced Routing**: Use the `data_source` type from the metadata to dynamically route requests to the correct implementation.

## Proposed Strategy
- **Strategy Pattern**: Define an interface for Ingestion Workflows.
- **Factory Pattern**: A factory inside `workflow.py` or `handler.py` to resolve the correct workflow instance based on type.
