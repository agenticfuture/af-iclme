# Privacy Current State v1.6.0

## Status
- The privacy domain now has its first SaaS user-facing flow.
- Users can create privacy requests from SaaS and open a dedicated request detail page backed by the new privacy request/status APIs.

## Newly Implemented SaaS Flow
- Privacy landing page:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-saas/app/dashboard/privacy/page.tsx`
- Privacy request detail page:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-saas/app/dashboard/privacy/requests/[id]/page.tsx`
- Privacy landing component:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-saas/components/dashboard/privacy-dashboard.tsx`
- Privacy request detail component:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-saas/components/dashboard/privacy-request-view.tsx`
- SaaS privacy proxy route:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-saas/app/api/privacy/[...path]/route.ts`

## Current User-Facing Capability
- Create export request
- Create delete request
- View request detail/status
- Refresh request detail/status

## Current Product Boundary
- Export requests:
  - still inventory-based
- Delete requests:
  - still chatbot-delete only
- Redact:
  - visible in the UI as planned next work
  - still not executable

## Verification
- Implementation completed for the SaaS privacy flow and proxy layer.
- A narrow SaaS TypeScript transpile check was started in the SaaS container, but it did not complete within the short verification window and is not yet marked passed.

## Main Planning Reference
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/af-iclme/layers/ideas/privacy/IP/implementation_plan_v1.1.0.md`
