# Walkthrough - Fix Job Queue CORS/Failure Path on `/api/job/.../ingest-file` (CHG-033)

## Objective
Fix the failing step-3 enqueue call:
- `POST /api/job/services/{service_id}/jobs/ingest-file`
that was surfacing as browser CORS error and `Queue failed for file: Files`.

## Root Cause
The request path was failing server-side when job storage (`job` schema / `job.jobs` table) was unavailable.  
This produced backend failures that appeared in browser as CORS/network-style errors.

## Implemented Fixes
1. Runtime-safe job storage bootstrap:
- Updated `capabilities/job/caps/create_job/tasks.py`
- Added `_ensure_job_storage()`:
  - `CREATE SCHEMA IF NOT EXISTS job`
  - `Job.__table__.create(..., checkfirst=True)`
- Called before:
  - `create_job(...)`
  - `list_pending_jobs(...)`
  - `execute_job(...)`

2. Hardened job API error handling:
- Updated `capabilities/job/caps/create_job/api.py`
- Wrapped enqueue/execute handlers with explicit `HTTPException` responses for unexpected failures, so frontend receives structured error payloads.

3. Schema migration baseline alignment:
- Updated `capabilities/db/migrations/versions/0000_create_schemas.py`
- Added `job` schema to base schema list to keep migration path consistent.

## Validation
- Python syntax check passed:
  - `capabilities/job/caps/create_job/api.py`
  - `capabilities/job/caps/create_job/tasks.py`
  - `capabilities/db/migrations/versions/0000_create_schemas.py`

## Tracking
- Prompt copy saved:
  - `af-iclme/execution-plans/already_run/37_exe_plan_template_prompt.md`
- Walkthrough saved:
  - `af-iclme/layers/ideas/IDEA-SERV-CREATION-FINALIZE/changes/CHG-033/walkthrough.md`
