# Architecture: Granular Knowledge Ingestion

## Overview
Transitions from a server-side bulk ingestion model to a client-side orchestrated model.

## Component Diagram
```mermaid
graph TD
    UI[Frontend Wizard] -->|POST /file| API_File[Ingest API: /file]
    UI -->|POST /url| API_Url[Ingest API: /url]
    
    API_File -->|Sync| Handler[Ingest Handler]
    API_Url -->|Sync| Handler
    
    Handler -->|Flow| Workflow[Ingest Workflow]
    Workflow -->|Task| MinioTask[MinIO Upload Task]
    Workflow -->|Task| DbTask[DB Registration Task]
    
    MinioTask -->|S3| MinIO[MinIO Server]
```

## API Specifications

### `POST /api/knowledge-base/services/{service_id}/ingest/file`
- **Content-Type**: `multipart/form-data`
- **Fields**:
  - `files`: File[]
  - `metadata`: JSON string (optional)

### `POST /api/knowledge-base/services/{service_id}/ingest/url`
- **Content-Type**: `application/json`
- **Body**:
  ```json
  {
    "urls": ["string"]
  }
  ```
