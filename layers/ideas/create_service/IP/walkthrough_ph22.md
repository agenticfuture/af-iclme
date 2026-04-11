# Walkthrough PH22 - Public Embed to Scoped Chat Bridge

## Objective
Verify the full contract join between:
- public embed availability (`published + paid`)
- scoped embed token acceptance
- chatbot route execution
- scoped DB persistence (`Chat` + `Message_v2`)

## What Was Added

### 1) Chatbot bridge contract
- Added:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-ai-chatbot/scripts/test-public-embed-chat-bridge-contract.ts`
- Updated:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-ai-chatbot/package.json`

The bridge contract:
1. Loads the scoped service context
2. Confirms `public_embed` availability is currently allowed
3. Generates a signed scope token
4. Executes `handleChatPost(...)` in public embed mode
5. Verifies SSE output
6. Verifies persisted `Chat` and `Message_v2` rows carry exact `tenant_id`, `org_id`, `service_id`

### 2) Availability transition script improved
- Updated:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-saas/scripts/test-embed-availability-transitions.ts`

Added `KEEP_PUBLIC_ALLOWED=1` mode so the scoped service can be normalized to:
- `service_status=active`
- `deployment_status=published`
- `billing_status=paid`

without revoking billing at the end.

## Verification

### A) Normalize live service into public-allowed state

```sh
docker compose -f docker-compose.generated.yml exec -T service-gen-saas-e2e \
  sh -lc 'cd /app && KEEP_PUBLIC_ALLOWED=1 timeout 45s ./node_modules/.bin/tsx ./scripts/test-embed-availability-transitions.ts'
```

Observed:
- `published_paid.allowed = true`
- `published_paid.reason = public_allowed`

### B) Run chatbot public bridge contract

```sh
docker compose -f docker-compose.generated.yml exec -T service-gen-ai-chatbot-e2e \
  sh -lc 'cd /app && timeout 45s ./node_modules/.bin/tsx scripts/test-public-embed-chat-bridge-contract.ts'
```

Observed result:

```json
{
  "ok": true,
  "service_id": "8ec3ebbc-5046-4fad-8370-f8fac5014f8d",
  "availability": {
    "allowed": true,
    "reason": "public_allowed",
    "deployment_status": "published",
    "billing_status": "paid",
    "access_scope": "public_embed"
  },
  "chat_id": "08cf3e47-a595-43a7-a865-3f38f896e628",
  "message_count": 2,
  "tenant_id": "3cd153b2-1bbf-478a-9019-cb3de47a2966",
  "org_id": "01cc21bb-db5c-46c8-970d-9e4ba8fe2fc0"
}
```

## Result

The create_service embed/runtime slice now has direct evidence that:
- public embed is allowed only after the correct lifecycle state
- the embed token is accepted in `public_embed` mode
- the chatbot route succeeds
- persisted chat and message rows remain scoped to the exact tenant/org/service

This closes the live contract bridge between service lifecycle policy and chatbot persistence for the current implementation plan.
