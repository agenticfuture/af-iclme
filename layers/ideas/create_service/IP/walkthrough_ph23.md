# Walkthrough PH23 - Anonymous Actor Cookie Binding + Isolation

## Objective
Close the remaining non-browser security gap in `create_service` Phase 5 by replacing the raw anonymous user cookie with a signed actor cookie and verifying reuse, tamper isolation, legacy migration, and scoped public-embed persistence.

## Code Changes
1. Added signed anonymous actor helper:
   - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-ai-chatbot/lib/chat-api/anonymous-actor.ts`
   - HMAC-signed cookie payload with:
     - `uid`
     - `sid`
     - `iat`
     - `v`
2. Updated chat handler:
   - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-ai-chatbot/lib/chat-api/handle-chat.ts`
   - behavior now:
     - trust authenticated users first
     - trust only verified signed anonymous actor cookie
     - migrate legacy `sg_anon_user_id` to signed cookie if the user still exists
     - create a fresh guest actor when cookie is missing/invalid
3. Updated contracts to assert signed cookie issuance and verification:
   - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-ai-chatbot/scripts/test-chat-route-contract.ts`
   - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-ai-chatbot/scripts/test-public-embed-chat-bridge-contract.ts`
4. Added dedicated isolation contract:
   - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-ai-chatbot/scripts/test-anonymous-actor-isolation-contract.ts`
5. Added package script:
   - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-ai-chatbot/package.json`
6. Updated security layer artifacts:
   - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/af-iclme/layers/ideas/create_service/Security/test_plan.md`
   - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/af-iclme/layers/ideas/create_service/Security/test_report.md`
   - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/af-iclme/layers/ideas/create_service/Security/traceability_report.md`

## Verification Executed
1. Chat success contract with signed anonymous actor cookie:
```bash
docker compose -f /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/docker-compose.generated.yml exec -T \
  -e SERVICEGEN_SCOPE_JSON='{"service_id":"8ec3ebbc-5046-4fad-8370-f8fac5014f8d","tenant_id":"3cd153b2-1bbf-478a-9019-cb3de47a2966","org_id":"01cc21bb-db5c-46c8-970d-9e4ba8fe2fc0"}' \
  service-gen-ai-chatbot-e2e \
  sh -lc 'cd /app && timeout 90s ./node_modules/.bin/tsx scripts/test-chat-route-contract.ts'
```
Result: PASS

2. Chat security rejection contract:
```bash
docker compose -f /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/docker-compose.generated.yml exec -T \
  service-gen-ai-chatbot-e2e \
  sh -lc 'cd /app && timeout 90s ./node_modules/.bin/tsx scripts/test-chat-route-security-contract.ts'
```
Result: PASS

3. Anonymous isolation contract:
```bash
docker compose -f /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/docker-compose.generated.yml exec -T \
  service-gen-ai-chatbot-e2e \
  sh -lc 'cd /app && timeout 90s ./node_modules/.bin/tsx scripts/test-anonymous-actor-isolation-contract.ts'
```
Result: PASS

4. Public embed bridge contract with isolated availability input:
```bash
docker compose -f /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/docker-compose.generated.yml exec -T \
  -e SERVICEGEN_SCOPE_JSON='{"service_id":"8ec3ebbc-5046-4fad-8370-f8fac5014f8d","tenant_id":"3cd153b2-1bbf-478a-9019-cb3de47a2966","org_id":"01cc21bb-db5c-46c8-970d-9e4ba8fe2fc0"}' \
  -e SERVICEGEN_PUBLIC_AVAILABILITY_JSON='{"allowed":true,"reason":"public_allowed","hide_widget":false,"deployment_status":"published","billing_status":"paid","access_scope":"public_embed"}' \
  service-gen-ai-chatbot-e2e \
  sh -lc 'cd /app && timeout 150s ./node_modules/.bin/tsx scripts/test-public-embed-chat-bridge-contract.ts; echo EXIT:$?'
```
Result: PASS (`EXIT:0`)

## Evidence Summary
- Anonymous embed actors are now bound by a signed cookie rather than a raw user id cookie.
- Reusing a valid signed cookie reuses the same anonymous actor.
- Tampering the cookie does not allow access to an existing chat; the request is isolated and rejected (`403`).
- Legacy raw anonymous cookie values migrate forward to signed cookies without creating a new actor.
- Public embed bridge still persists scoped chat and message rows with:
  - `tenant_id`
  - `org_id`
  - `service_id`

## Outcome
Phase 5 anonymous isolation is now closed at the non-browser security/contract layer for `create_service`.
