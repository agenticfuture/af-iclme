# Architecture: Knowledge Base Ingestion

## Overview
The Knowledge Base Ingestion capability allows users to upload various data source types (Files, URLs, S3) to power the AI Service. All file-based knowledge is stored in MinIO, while structural data is recorded in the ServiceGen database.

## Components

### 1. Frontend (Next.js)
- **Component**: `NewServicePage` (Step 3)
- **Responsibility**: 
    - Support batch addition of files.
    - Track a collection of data sources (type + value/files).
    - Perform a unified ingest request on "Next".

### 2. Backend API (FastAPI)
- **Route**: `POST /services/{service_id}/data-sources`
- **Responsibility**: 
    - Parse multipart/form-data.
    - `files`: Collection of `UploadFile` objects.
    - `metadata`: JSON payload describing the source types and their association (e.g., which files belong to which logical "source" entry).

### 3. MinIO Client (Task Layer)
- **Responsibility**: Partitioned storage under `/{tenant_id}/{org_id}/{service_id}/{filename}`.

## Data Flow
```mermaid
sequenceDiagram
    participant U as User (UI)
    participant B as Backend API
    participant M as MinIO Storage
    participant DB as Database

    U->>U: Add multiple Files/URLs
    U->>U: Click "Next"
    U->>B: POST /services/{service_id}/data-sources (Multipart)
    B->>B: Process Metadata (URLs, etc.)
    B->>DB: Save Data Source Records
    B->>B: Upload Files to MinIO
    B->>M: PUT Object (Partitioned Path)
    B-->>U: {"status": "success", "processed": [...]}
```

## Storage Structure
Bucket: `servicegen-knowledge`
Path: `/{tenant_id}/{org_id}/{service_id}/{filename}`
