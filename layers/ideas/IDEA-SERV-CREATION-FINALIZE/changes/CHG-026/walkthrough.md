# Walkthrough - Embed Blocking Route + Bot Host Enforcement (CHG-026)

## Objective
Fix the embedded bot runtime error:
- `Uncached data was accessed outside of <Suspense>` in `app/embed/[serviceId]/page.tsx`

And ensure iframe/widget loading resolves from the bot container host:
- `https://bot.servicegen.local`

## Changes Implemented
1. Removed async request-data awaits from embed route pages
- Updated:
  - `ui-apps/service-gen-ai-chatbot/app/embed/[serviceId]/page.tsx`
  - `ui-apps/service-gen-ai-chatbot/app/iframe/[serviceId]/page.tsx`
- Converted both pages to client components using:
  - `useParams`
  - `useSearchParams`
- This eliminates server-side `await params` / `await searchParams` that triggered Next.js blocking-route behavior.

2. Forced widget host to bot container URL
- Updated:
  - `ui-apps/service-gen-ai-chatbot/app/widget.js/route.ts`
- Host resolution now always uses:
  - `https://bot.servicegen.local`
- This prevents fallback to unintended hosts and ensures embed iframe loads from bot app container domain.

## Context Isolation Confirmation
Realm parameters are still forwarded and preserved:
- `service_id`
- `tenant_id`
- `org_id`

## Tracking
- Execution plan copy saved to:
  - `af-iclme/execution-plans/already_run/30_exe_plan_template_prompt.md`
- Walkthrough saved to:
  - `af-iclme/layers/ideas/IDEA-SERV-CREATION-FINALIZE/changes/CHG-026/walkthrough.md`
