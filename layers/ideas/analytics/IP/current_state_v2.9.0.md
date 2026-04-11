# Analytics Current State v2.9.0

## Completed In This Slice
- Improved tenant-aware suggested preset selection.
- Suggested presets no longer default to the first available service.
- Presets now choose the most relevant service for the shortcut type:
  - `Ops Review` prefers healthy active/published services with meaningful recent activity.
  - `Failed Ingestion` prefers services with the highest failure signal.
  - `Conversation Watch` prefers the busiest conversation-oriented service.
- Applied the smarter selection logic to both the analytics dashboard and the dedicated activity page.

## Main Files
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-saas/components/dashboard/analytics-saved-presets.ts`
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-saas/components/dashboard/analytics-dashboard.tsx`
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-saas/components/dashboard/analytics-activity-view.tsx`

## Behavior
- Suggested presets are still URL-driven and shareable.
- The selected default service is now derived from live analytics relevance instead of list order.
- Activity view falls back to activity-derived service relevance when full service analytics are not present.

## Verification
- SaaS TypeScript sanity check passed for the updated preset helper and both analytics views.

## Deferred
- Browser E2E remains intentionally deferred.
