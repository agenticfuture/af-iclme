# Privacy Current State v1.5.0

## Status
- The privacy domain now includes backend request tracking and request-status APIs.
- This adds the first real synchronization layer needed for a future SaaS privacy UI.

## Newly Implemented
- Persisted privacy request records in core DB:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/db/models/privacy.py`
- Request storage adapter:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/privacy/adapters/request_store.py`
- Request creation cap:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/privacy/caps/create_subject_request/api.py`
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/privacy/caps/create_subject_request/functions.py`
- Request status cap:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/privacy/caps/get_subject_request_status/api.py`
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/privacy/caps/get_subject_request_status/functions.py`

## Current Request Flow
- `POST /api/privacy/v1/subjects/requests`
  - creates a persisted privacy request record
  - executes supported actions synchronously for now:
    - `export`
    - `delete`
  - stores normalized result summary
- `GET /api/privacy/v1/subjects/requests/{request_id}`
  - returns request status and stored result metadata

## Current Capability Boundary
- export:
  - still inventory-only
  - now available through tracked request creation
- delete:
  - chatbot delete remains the only destructive execution currently implemented
  - now available through tracked request creation
- redact:
  - request creation returns not implemented

## Verification
- Python syntax compilation passed for:
  - new privacy DB model
  - request store
  - create request cap
  - request status cap
  - request-status contract test file

## Verification Gap
- A live request-status contract test file has been added:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/tests/test_privacy_request_status_contract.py`
- In the normal API container, this new test file is still stalling during the pytest path and has not yet been marked as passed.
- Existing privacy export/delete contract tests remain green.

## Main Planning Reference
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/af-iclme/layers/ideas/privacy/IP/implementation_plan_v1.1.0.md`
