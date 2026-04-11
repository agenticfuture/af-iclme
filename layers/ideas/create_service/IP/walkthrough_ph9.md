# Create Service - Phase 9 Walkthrough
Date: 2026-03-02
Idea: `create_service`
Layer: Security (L5)

## Scope
- Re-validate `create_service` security controls on real API/browser flow.
- Close auth gap on job ingestion endpoints.

## Code Changes
- Added gateway auth enforcement on job endpoints:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/job/caps/create_job/api.py`
  - Added `@gateway_policy(auth_required=True, ...)` on:
    - `POST /api/job/services/{service_id}/jobs/ingest-file`
    - `POST /api/job/services/{service_id}/jobs/ingest-url`
    - `POST /api/job/services/{service_id}/jobs/execute`
- Added negative auth tests for ingestion endpoints:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/tests/test_create_service_security_controls.py`

## Commands Executed
1. API security suite:
```bash
docker compose -f /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/docker-compose.generated.yml \
  --env-file /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/.env \
  --env-file /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/.env.secrets \
  exec -T service-gen-api /app/.venv/bin/python -m pytest -q \
  /app/tests/test_create_service_security_controls.py \
  /app/tests/test_gateway_policy_middleware.py \
  /app/tests/test_service_suggest_endpoint.py \
  /app/tests/test_create_service_agent_security.py
```
Result: `11 passed`

2. Browser security header check:
```bash
docker compose -f /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/docker-compose.generated.yml \
  --env-file /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/.env \
  --env-file /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/.env.secrets \
  exec -T playwright-test sh -lc \
  'cd /work && pnpm exec playwright test tests/e2e/security-headers.spec.ts --reporter=line --workers=1 --output=/tmp/pw-output --trace=off'
```
Result: `1 passed`

3. Browser sandbox assertions via create-service playground:
```bash
docker compose -f /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/docker-compose.generated.yml \
  --env-file /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/.env \
  --env-file /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/.env.secrets \
  exec -T playwright-test sh -lc \
  'cd /work && pnpm exec playwright test tests/e2e/create-service-playground-flow.spec.ts --grep "wizard finish redirects to playground and both embed modes are functional" --reporter=line --workers=1 --output=/tmp/pw-output --trace=off'
```
Result: `1 passed`

## Security Artifacts Updated
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/af-iclme/layers/ideas/create_service/Security/test_plan.md`
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/af-iclme/layers/ideas/create_service/Security/test_report.md`
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/af-iclme/layers/ideas/create_service/Security/traceability_report.md`

## Outcome
- Security layer remains PASS for implemented scope.
- Job ingestion endpoints now enforce authentication at gateway policy level.
