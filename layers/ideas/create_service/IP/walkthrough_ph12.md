# Create Service - Phase 12 Walkthrough
Date: 2026-03-02
Idea: `create_service`
Layers: Security (L5) + Privacy (L4) closure

## Objective
- Close remaining gaps:
  1. Route-level role parity for create_service + job ingest flows.
  2. Prevent prompt exposure to lower-privileged users.
  3. Add URL-content PII scanning and block ingestion on detection.

## Implemented Changes
1. Role parity hardening:
   - Added `required_roles` on service mutating routes and job ingest/execute routes.
   - Files:
     - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/service/caps/create_service/api.py`
     - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/job/caps/create_job/api.py`

2. Prompt exposure control:
   - Service serialization now accepts `include_prompt`.
   - Prompt hidden for non-admin scopes (`human_agent`), visible for admin scopes (`tenant_admin`, `admin`, `owner`).
   - File:
     - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/service/caps/create_service/api.py`

3. URL-content PII scanning:
   - Added real fetch + scan for URL content before URL ingest job enqueue.
   - Reuses PII detection strategy and returns findings with location.
   - Files:
     - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/job/caps/create_job/workflow.py`
     - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/job/caps/create_job/api.py`

## Test Additions
1. Role checks:
   - `suggest` endpoint denied for non-admin scope role.
   - File:
     - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/tests/test_create_service_security_controls.py`

2. Prompt visibility by role + agent service isolation:
   - Human agent can access assigned service only.
   - Prompt hidden for human agent, visible to tenant admin.
   - File:
     - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/tests/test_create_service_agent_security.py`

3. URL PII scan behavior:
   - PII URL content blocked (`422`, with findings).
   - Clean URL content allowed (`200`, job queued).
   - File:
     - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/tests/test_create_service_privacy_controls.py`

4. Auth token role alignment in existing tests:
   - Updated test auth headers to include admin scope role where required.
   - Files:
     - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/tests/test_create_service_flow_contract.py`
     - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/tests/test_service_suggest_endpoint.py`
     - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/tests/test_create_service_privacy_controls.py`

## Verification Commands + Results
1. API regression:
```bash
docker compose -f /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/docker-compose.generated.yml \
  --env-file /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/.env \
  --env-file /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/.env.secrets \
  exec -T service-gen-api /app/.venv/bin/python -m pytest -q \
  /app/tests/test_create_service_flow_contract.py \
  /app/tests/test_create_service_security_controls.py \
  /app/tests/test_create_service_agent_security.py \
  /app/tests/test_create_service_privacy_controls.py \
  /app/tests/test_gateway_policy_middleware.py \
  /app/tests/test_service_suggest_endpoint.py
```
Result: `23 passed`

2. Browser regression:
```bash
docker compose -f /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/docker-compose.generated.yml \
  --env-file /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/.env \
  --env-file /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/.env.secrets \
  exec -T playwright-test sh -lc \
  'cd /work && pnpm exec playwright test tests/e2e/create-service-playground-flow.spec.ts tests/e2e/security-headers.spec.ts --reporter=line --workers=1 --output=/tmp/pw-output --trace=off'
```
Result: `3 passed`

## Artifacts Updated
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/af-iclme/layers/ideas/create_service/Security/test_report.md`
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/af-iclme/layers/ideas/create_service/Security/traceability_report.md`
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/af-iclme/layers/ideas/create_service/Privacy/test_report.md`

## Outcome
- Requested gaps (1,2,4) are implemented and validated with real API/browser tests.
