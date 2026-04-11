# Privacy Current State v2.2.0

## Status
- Privacy request detail UI now renders action-specific result summaries for redact/delete flows.
- Redact create/status/detail runtime checks through SaaS proxy are passing.
- Privacy request store read/update now uses explicit tenant/org scoped access to avoid record readback gaps.
- Privacy/API contract test slice is green after scope + FK-seed stability fixes.

## Implemented
- Structured summary rendering for non-export actions in privacy request view:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-saas/components/dashboard/privacy-request-view.tsx`
- Added result cards:
  - `Redaction Summary`
  - `Deletion Summary`
- Keeps raw `Result Summary` JSON card for diagnostics.

## Verified Runtime Result
- Via SaaS redact proxy probe:
  - bootstrap: `200`
  - create redact request: `200`
  - request status read: `200`
  - request detail page: `200`

## Verified Test Result
- Command:
  - `docker compose -f /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/docker-compose.generated.yml exec -T service-gen-api /app/.venv/bin/pytest -q /app/tests/test_privacy_export_contract.py /app/tests/test_privacy_delete_contract.py /app/tests/test_privacy_redact_contract.py /app/tests/test_privacy_request_status_contract.py /app/tests/test_analytics_privacy_contract.py`
- Result:
  - `10 passed in 33.54s`

## Current Product Boundary
- Export:
  - working with structured payload and JSON download
- Delete:
  - still chatbot-delete only
- Redact:
  - working via request tracking and SaaS proxy
  - request detail page now has readable redaction result cards
- Browser E2E:
  - still intentionally deferred

## Main Planning Reference
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/af-iclme/layers/ideas/privacy/IP/implementation_plan_v1.1.0.md`
