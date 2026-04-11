# Create Service - Phase 10 Walkthrough
Date: 2026-03-02
Idea: `create_service`
Layer: Security (L5) completion

## Objective
- Close the remaining security partials and finish Security layer.

## Final Security Changes
1. Gateway policy enhancements:
   - Added `required_roles` support.
   - Added `agent_service_scope` enforcement for service-scoped human-agent reads.
   - File: `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/policy/gateway_policy.py`

2. Service API policy wiring:
   - `POST /api/service/services` now role-gated (`tenant_admin`, `admin`, `owner`).
   - `GET /api/service/v1/services/{service_id}` now enforces service-scope for `human_agent`.
   - File: `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/service/caps/create_service/api.py`

3. Job API auth hardening (already added in previous phase, retained):
   - Ingest/execute job endpoints require auth via gateway policy.
   - File: `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/job/caps/create_job/api.py`

4. Security test additions:
   - Role gate test for create-service endpoint.
   - Human-agent assigned vs unassigned service access tests.
   - Files:
     - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/tests/test_create_service_security_controls.py`
     - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/tests/test_create_service_agent_security.py`

## Verification Commands and Results
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
Result: `13 passed`

2. Browser security checks:
```bash
docker compose -f /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/docker-compose.generated.yml \
  --env-file /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/.env \
  --env-file /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/.env.secrets \
  exec -T playwright-test sh -lc \
  'cd /work && pnpm exec playwright test tests/e2e/security-headers.spec.ts tests/e2e/create-service-playground-flow.spec.ts --grep "wizard finish redirects to playground and both embed modes are functional|SaaS responses deny iframe embedding" --reporter=line --workers=1 --output=/tmp/pw-output --trace=off'
```
Result: `2 passed`

## Artifact Updates
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/af-iclme/layers/ideas/create_service/Security/test_plan.md`
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/af-iclme/layers/ideas/create_service/Security/test_report.md`
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/af-iclme/layers/ideas/create_service/Security/traceability_report.md`

## Outcome
- Security layer for `create_service` is now complete with passing API + browser security evidence.
