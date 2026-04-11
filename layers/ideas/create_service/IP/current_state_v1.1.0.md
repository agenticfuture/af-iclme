# Create Service Current State v1.1.0

## Date
2026-03-02

## Overall State
Partially stabilized and operational with real data paths.

## Confirmed Working
1. Create-service backend product/security/privacy suites are passing.
2. Wizard flow e2e scenarios are passing in reruns.
3. DB persistence is present for service, jobs, and deployments.
4. Deployment records are being created with live bot URL context.
5. Bot stream endpoint (`/api/chat`) returns real SSE chunks with text deltas.

## Applied Runtime Fixes
1. `NEXTAUTH_URL` aligned to `https://bot.servicegen.local`.
2. Secure-cookie detection made request-aware for HTTPS/forwarded-proto.
3. Chat surfaces made public in bot proxy for embed/playground usage.
4. Chat layout adjusted so embed mode skips auth dependency path.

## Known Runtime Caveat
1. Direct `/chat` page rendering remains slow/intermittent in this mounted `pnpm dev` compose profile.
2. Stream API path is functional and validated (`/api/chat`).
3. Attempted `pnpm build && pnpm start` path in this compose-mounted setup stalled during `next build`, so runtime reverted to `pnpm dev` for continuity.

## Recommended Next Hardening
1. Move chatbot runtime validation to image-based (non-bind-mounted) startup for deterministic `build/start`.
2. Keep current auth/cookie fixes.
3. Re-run full browser chat-page rendering verification after image-mode startup.
