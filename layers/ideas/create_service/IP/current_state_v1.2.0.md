# Create Service Current State v1.2.0

## Date
2026-04-04

## Overall State
Non-browser implementation and verification slices are operational with real scope, persistence, deployment-state, and public/embed contract coverage.

## Confirmed Working
1. Create-service backend product, security, and privacy suites are in place.
2. Scoped embed token enforcement is active for bot runtime requests.
3. Chatbot DB persistence stores `tenant_id`, `org_id`, and `service_id` on `Chat` and `Message_v2`.
4. Public embed policy transitions are verified for `sandboxed`, `published`, billing-paid, and billing-revoked states.
5. Public embed bridge persists real scoped chat/message rows through `/api/chat` handler contracts.
6. Anonymous embed actors now use a signed cookie binding with:
   - reuse on valid cookie
   - forced isolation on tamper
   - legacy cookie migration

## Applied Runtime Fixes
1. SaaS embed outputs standardized around shared runtime generation.
2. Bot embed/playground route split onto a dedicated `EmbedChat` surface.
3. Bot health endpoint added for cheap runtime checks.
4. Anonymous raw cookie replaced by signed actor binding (`sg_anon_actor`).

## Known Runtime Caveat
1. Browser playground verification remains unstable in the current compose-mounted `next dev` profile.
2. The remaining instability is on the visual/browser surface, not on the scoped contract, SSE handler, or DB persistence layers.
3. Full browser chat/playground proof is deferred until the apps are served from a stable built runtime.

## Recommended Next Step
1. Treat `create_service` non-browser implementation as closed for the current slice.
2. Re-open browser playground/embed verification only after image-based runtime startup.
3. Proceed to the next capability implementation using the same layered test strategy.
