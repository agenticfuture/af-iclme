# CHG-035 Walkthrough

## Scope
This change set addresses the latest runtime and UX defects reported during bot/service creation and playground usage, with focus on vote API 404 loops, users/settings/analytics UX completeness, role handling, and real job execution feedback.

## Key fixes delivered

1. Bot vote 404 loop removed
- Updated vote endpoints to gracefully handle unauthenticated or missing-chat contexts for embedded/public realm sessions.
- Files:
  - `ui-apps/service-gen-ai-chatbot/app/(chat)/api/vote/route.ts`
  - `ui-apps/service-gen-ai-chatbot/app/(agent)/chat/api/vote/route.ts`
- Behavior:
  - `GET /api/vote` now returns `200 []` instead of `404` for unknown/unauthorized chat contexts.
  - `PATCH /api/vote` now returns `200` no-op messages for unknown/unauthorized contexts.

2. Users page moved from mock to backend-backed organization members
- Replaced static mock users with live organization member + invitation data via Auth0 Management API.
- File:
  - `ui-apps/service-gen-saas/app/dashboard/users/page.tsx`
- Reused the existing e2e flows already wired in members actions (invite/revoke/remove/update role).

3. Added `human_agent` role support end-to-end in member management forms/actions
- Added role mapping and labeling helpers:
  - `ui-apps/service-gen-saas/lib/roles.ts`
- Added env contract:
  - `ui-apps/service-gen-saas/types/node.process.env.d.ts`
- Enabled role in invite/update UI and validation:
  - `ui-apps/service-gen-saas/app/dashboard/organization/members/actions.ts`
  - `ui-apps/service-gen-saas/app/dashboard/organization/members/create-invitation-form.tsx`
  - `ui-apps/service-gen-saas/app/dashboard/organization/members/members-list.tsx`
  - `ui-apps/service-gen-saas/app/dashboard/organization/members/invitations-list.tsx`
  - `ui-apps/service-gen-saas/app/dashboard/organization/members/page.tsx`
- Added runtime guard: non-member role assignment errors clearly if role ID env var is missing.

4. Analytics and Settings navigation completion
- Added Analytics page with explicit `Coming Soon` state.
  - `ui-apps/service-gen-saas/app/dashboard/analytics/page.tsx`
- Added sidebar badge `Coming Soon` on Analytics entry.
  - `ui-apps/service-gen-saas/components/dashboard/sidebar.tsx`
- Added settings/account root routes to avoid dead-end navigation.
  - `ui-apps/service-gen-saas/app/dashboard/settings/page.tsx` (redirect)
  - `ui-apps/service-gen-saas/app/dashboard/account/page.tsx` (redirect)

5. Create-service finish now reflects true backend job execution state
- Reads actual `executed` and `failed` counts returned by job execution API and updates progress text.
- Fails deployment step if job execution reports failures.
- File:
  - `ui-apps/service-gen-saas/app/dashboard/services/new/page.tsx`

6. Duplicate name protections for service and bot creation
- Added backend duplicate checks (case-insensitive, tenant-scoped, excluding soft-deleted).
- Returns `409` with explicit detail for duplicate service or bot names.
- Files:
  - `capabilities/service/caps/create_service/tasks.py`
  - `capabilities/service/caps/create_service/api.py`
- Frontend now surfaces backend detail messages for create-service/create-bot failures.
  - `ui-apps/service-gen-saas/app/dashboard/services/new/page.tsx`

## Operational impact
- Bot frontend should no longer spam 404s on `/api/vote` during embedded/public sessions.
- Users section is now real-data driven and role-aware, including `human_agent`.
- Analytics route exists and clearly communicates staged availability.
- Create flow finish status reflects actual backend job completion state instead of static status text.
- Duplicate service/bot naming now blocked with actionable feedback.

## Environment follow-up
- Set `AUTH0_HUMAN_AGENT_ROLE_ID` in SaaS env if you want real Auth0 role assignment for `human_agent` (otherwise guarded error is shown).

