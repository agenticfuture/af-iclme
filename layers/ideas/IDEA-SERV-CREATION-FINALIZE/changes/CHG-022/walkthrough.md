# Walkthrough - ServiceDetails Params Promise Fix (CHG-022)

## Root Cause
`/dashboard/services/[id]` server page accessed `params.id` synchronously even though `params` is Promise-based in this Next.js runtime contract.

## Fix Applied
- Updated page signature to Promise params and unwrapped `id` with `await`.
- Replaced all route link usages from `params.id` to resolved `serviceId`.
- Added robust server-side API base URL fallback for service fetch.

## File Changed
- `ui-apps/service-gen-saas/app/dashboard/services/[id]/page.tsx`

## Guardrails Preserved
- Did not remove wizard sections that create service and bot IDs.
  - step 1 create service call remains
  - step 2 create chatbot call remains

## Tracking
- Prompt copy saved: `af-iclme/execution-plans/already_run/26_exe_plan_template_prompt.md`
- Walkthrough saved: `af-iclme/layers/ideas/IDEA-SERV-CREATION-FINALIZE/changes/CHG-022/walkthrough.md`
