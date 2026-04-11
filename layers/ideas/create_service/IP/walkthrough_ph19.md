# Walkthrough PH19 - Chat Route Security Contract Closure

## Objective
Close the remaining `/api/chat` route contract gap without returning to browser E2E by validating the rejection paths at the extracted handler boundary.

## What Was Added

### 1) New route-level security contract
- Added:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-ai-chatbot/scripts/test-chat-route-security-contract.ts`
- Updated:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-ai-chatbot/package.json`

### 2) Covered rejection cases
The new contract script executes `handleChatPost(...)` directly and verifies:
- missing embed scope token in embed mode -> `401`
- invalid embed scope token -> `401`
- token/body scope mismatch -> `403`
- embed context access-scope mismatch (`public_embed` token used for `playground`) -> `403`
- invalid direct scope values without token -> `400`

The contract intentionally fails before DB writes or upstream model calls. The test dependencies throw if `saveChat`, `saveMessages`, or `fetchUpstream` are reached.

## Verification

Executed in docker, sequentially:

```sh
docker compose -f docker-compose.generated.yml exec -T service-gen-ai-chatbot-e2e \
  sh -lc 'cd /app && pnpm exec tsx scripts/test-chat-route-security-contract.ts'
```

Observed result:
- `ok: true`
- all rejection cases returned expected status and structured error body

## Result

The extracted chatbot route boundary is now covered on both sides:
- success path:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-ai-chatbot/scripts/test-chat-route-contract.ts`
- rejection/security path:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-ai-chatbot/scripts/test-chat-route-security-contract.ts`

This closes the current non-browser contract surface for scoped embed chat handling and keeps implementation aligned with the layered testing strategy.
