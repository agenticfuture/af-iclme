# Design Doc: Knowledge Base Ingest (Multi-Type)

## Objective
Implement structured ingestion for files, URLs, and other sources in the service wizard.

## API Definition
`POST /api/service/services/{service_id}/data-sources`

**Header**: `Content-Type: multipart/form-data`

### Input Fields:
- `metadata`: (String/JSON) 
  ```json
  {
    "sources": [
      { "type": "url", "values": ["https://site1.com", "https://site2.com"] },
      { "type": "file", "filenames": ["data.pdf", "manual.docx"] }
    ]
  }
  ```
- `files`: (List[UploadFile]) The actual binary files for "file" type sources.

## Logic
1. **Metadata Processing**: Parse the `metadata` JSON. Identify URL-based sources and S3 configs.
2. **File Storage**:
   - Initialize MinIO client.
   - For each file in `files`:
     - Path: `/{tenant}/{org}/{service}/{filename}`.
     - Upload to `servicegen-knowledge` bucket.
3. **Database Records**:
   - Create `DataSource` records in the database linked to the `service_id`.
   - Store URLs directly in the record metadata.
   - Store MinIO paths for file-based sources.

## Dependencies
- `minio` (Python)
- `python-multipart`

## Env Vars
- `MINIO_ENDPOINT`: `minio:9000`
- `MINIO_ACCESS_KEY`: from `.env.local`
- `MINIO_SECRET_KEY`: from `.env.local`
