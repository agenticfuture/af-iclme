# Design Doc: Robust Storage Initialization

## 1. Problem
Buckets are not appearing in MinIO, despite logic being present. This suggests a failure in the connection or execution phase that is not being surfaced.

## 2. Refined Logic
1.  **Environment Audit**: Verify `MINIO_ENDPOINT` at runtime.
2.  **Explicit Initialization**: Move bucket creation logic to a dedicated internal helper or ensure it's logged heavily.
3.  **Error Propagation**: Do not swallow connection errors. If MinIO is unreachable, the task must fail loudly.
4.  **Endpoint Grace**: Support both `minio:9000` (development) and `sg_minio:9000` (docker-internal) depending on environment signals.

## 3. Implementation Plan (tasks.py)
- Use `logger` to print the endpoint being used.
- Wrap `bucket_exists` and `make_bucket` in a try/except with detailed error messages.
- Add a check for successful connection before proceeding to upload.
