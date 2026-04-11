# Privacy Current State v1.9.0

## Status
- The SaaS privacy request detail page now exposes the export payload as a usable operator view instead of raw JSON only.
- Export request results can now be downloaded directly from the request detail page as a JSON file.

## Confirmed In Source
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-saas/components/dashboard/privacy-request-view.tsx`
  - adds structured export sections
  - adds export count summary cards
  - adds related service badges
  - adds `Download Export JSON`

## Product Behavior
- `/dashboard/privacy/requests/[id]`
  - still shows request metadata and backend summaries
  - now shows structured sections for:
    - request metadata
    - resolved subject
    - core records
    - chatbot records
    - inventory
  - allows direct JSON download when `result_summary.export_payload` is present

## Current Product Boundary
- Export:
  - real structured JSON payload in request summary
  - direct download available from the request detail page
- Delete:
  - still chatbot-delete only
- Redact:
  - still not implemented
- Browser E2E:
  - still intentionally deferred

## Verification
- Source update completed for the SaaS privacy request view.
- Narrow TypeScript/runtime sanity check was started for the updated component.

## Main Planning Reference
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/af-iclme/layers/ideas/privacy/IP/implementation_plan_v1.1.0.md`
