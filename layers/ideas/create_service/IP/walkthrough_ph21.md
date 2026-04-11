# Walkthrough PH21 - Embed Availability Transition Contract

## Objective
Replace the remaining browser-era embed policy verification with a direct live API contract that drives service/deployment/billing transitions and asserts the resulting public/playground availability decisions.

## What Was Added

### 1) New live contract script
- Added:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-saas/scripts/test-embed-availability-transitions.ts`

### 2) Package script entry
- Updated:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-saas/package.json`
- Added script:
  - `test:embed:availability-transitions`

## Contract Behavior

The script:
1. Reads the existing scoped service artifact from:
   - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-saas/tests/e2e_legacy/.artifacts/create_service_iframe_chat_scope_v1.json`
2. Builds a real HS256 session token using `SESSION_SECRET`.
3. Calls the live API at `https://api.servicegen.local`.
4. Normalizes the scoped service into the expected transition chain:
   - ensure `service_status=active`
   - if deployment is already `published`, first move it to `unpublished`
   - move deployment to `sandboxed`
5. Verifies:
   - `sandboxed + unpaid + public_embed` -> blocked (`not_published`)
   - `sandboxed + unpaid + playground` -> allowed (`playground_allowed`)
   - `published + unpaid + public_embed` -> blocked (`billing_required`)
   - `published + paid + public_embed` -> allowed (`public_allowed`)
   - revoke billing back to unpaid -> public blocked again (`billing_required`)

## Verification

Executed in docker:

```sh
docker compose -f docker-compose.generated.yml exec -T service-gen-saas-e2e \
  sh -lc 'cd /app && timeout 45s ./node_modules/.bin/tsx ./scripts/test-embed-availability-transitions.ts'
```

Observed result:
- `ok: true`
- service under test:
  - `8ec3ebbc-5046-4fad-8370-f8fac5014f8d`

Verified payloads included:
- `sandboxed_public.reason = not_published`
- `sandboxed_playground.reason = playground_allowed`
- `published_unpaid.reason = billing_required`
- `published_paid.reason = public_allowed`
- `revoked_public.reason = billing_required`

## Result

The create_service embed/runtime slice now has live contract evidence for:
- service/deployment/billing transition effects
- public-vs-playground access policy
- billing revocation behavior

This closes the remaining API-level availability matrix from Phase 6 of:
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/af-iclme/layers/ideas/create_service/IP/implementation_plan_v1.2.0.md`
