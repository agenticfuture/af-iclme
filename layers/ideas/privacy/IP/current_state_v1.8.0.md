# Privacy Current State v1.8.0

## Status
- Real export payload assembly is now live through the running API container.
- The SaaS privacy request flow is working end to end at the non-browser runtime layer.

## Confirmed Live
- `POST /api/privacy/v1/subjects/requests`
  - returns `status="completed"`
  - stores `result_summary.status="export_ready"`
  - stores `result_summary.export_payload`
- `GET /api/privacy/v1/subjects/requests/{request_id}`
  - returns the same stored `export_payload`
- `/dashboard/privacy`
  - loads through SaaS
- `/dashboard/privacy/requests/[id]`
  - loads through SaaS

## Executed Runtime Verification
- Focused SaaS proxy/runtime probe:
  - auth bootstrap: `200`
  - create privacy export request: `200`
  - get privacy request status: `200`
- Returned request summary now includes:
  - `status: "export_ready"`
  - `export_payload` present

## Current Product Boundary
- Export:
  - real structured JSON payload in request summary
- Delete:
  - still chatbot-delete only
- Redact:
  - still not implemented
- Browser E2E:
  - still intentionally deferred

## Main Planning Reference
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/af-iclme/layers/ideas/privacy/IP/implementation_plan_v1.1.0.md`
