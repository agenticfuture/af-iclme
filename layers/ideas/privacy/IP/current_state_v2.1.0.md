# Privacy Current State v2.1.0

## Status
- Privacy `redact` request flow is now live through the SaaS proxy path.
- The request tracking mismatch that caused `privacy request record was not persisted` has been fixed with explicit scoped request-store reads/updates.

## Implemented Fixes
- Request store now supports explicit tenant/org scoped operations for read/update paths:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/privacy/adapters/request_store.py`
- Create request flow now passes explicit scope to complete/fail/readback operations:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/privacy/caps/create_subject_request/functions.py`
- Request status retrieval now uses explicit scope on store read:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/privacy/caps/get_subject_request_status/functions.py`

## Verified Runtime Result
- Via SaaS proxy probe:
  - bootstrap: `200`
  - `POST /api/privacy/v1/subjects/requests` with `action=redact`: `200`
  - `GET /api/privacy/v1/subjects/requests/{request_id}`: `200`
- Returned request payload includes:
  - `status: completed`
  - `result_summary.status: redact_completed`
  - `result_summary.redacted: [...]`

## Current Product Boundary
- Export:
  - working with structured payload and detail-page download
- Delete:
  - still chatbot-delete only
- Redact:
  - working through request tracking + SaaS proxy path
  - first slice redacts content/labels while preserving records
- Browser E2E:
  - still intentionally deferred

## Main Planning Reference
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/af-iclme/layers/ideas/privacy/IP/implementation_plan_v1.1.0.md`
