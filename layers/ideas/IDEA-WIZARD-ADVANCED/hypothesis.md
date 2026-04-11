# Hypothesis: Advanced Wizard Journey

By integrating Step 3 with a dedicated `knowledge_base/ingest` capability backed by MinIO object storage, we enable users to build RAG-ready services directly from the wizard. Fixing Step 2 and finalizing Step 5's deployment trigger completes the "Zero to AI Service" flow, while appropriate UI markers (blur/coming soon) manage user expectations for future features (Channels/Agents).

## Verification
- Step 1: Service ID returned and stored in frontend.
- Step 2: Chatbot record verified in DB after click.
- Step 3: Files appear in MinIO path `minio/servicegen-knowledge/{tenant_id}/{org_id}/{service_id}/`.
- Step 5: Service Playground reachable via redirect.
