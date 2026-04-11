# Hypothesis: Granular Control Improves Ingest Reliability

The generic "bulk" endpoint proved complex to manage for heterogeneous data (balancing files vs URLs). By decomposing into granular endpoints (`/file`, `/url`), we:
1.  **Simplify Payloads**: Clear separation between `multipart/form-data` for files and `application/json` for URLs.
2.  **Enhance Traceability**: Prefect flows will now correspond to specific atomic ingestion events.
3.  **Improve UI Logic**: Client-side coordinate allows the wizard to provide immediate feedback on each source.

## Proposed Strategy
- **Backend**: Replace `ingest_data_sources` with `ingest_file`, `ingest_url`, etc.
- **Frontend**: Update Step 3 of the Knowledge Base wizard to call these endpoints individually.
- **Validation**: Implement Zod/React-Hook-Form validation for each source type.
