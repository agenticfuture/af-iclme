# Create Service - Phase 11 Walkthrough
Date: 2026-03-02
Idea: `create_service`
Layer: Privacy (L4)

## Objective
- Implement hard pre-upload PII scanning in Data Sources step.
- If PII is found, block upload/queue and show file + location to the user.

## Code Changes
1. Added pre-upload PII scanner in ingest workflow:
   - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/job/caps/create_job/workflow.py`
   - New `PiiDetectionError`
   - Scans file content by line (`email`, `ssn`, `sin`) before any MinIO upload/job creation.
   - Returns findings with:
     - `file`
     - `line`
     - `location`
     - `pii_type`
     - `match_preview`

2. Added structured API error for PII detection:
   - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/job/caps/create_job/api.py`
   - Returns HTTP `422` with:
     - `error: pii_detected`
     - `message`
     - `findings[]`

3. UI feedback in Data Sources step:
   - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-saas/app/dashboard/services/new/page.tsx`
   - Enhanced API error parsing for structured `pii_detected`.
   - Shows compact finding list (file + location + pii_type) in user-facing error.
   - Keeps source status as error and blocks progress for failed source.

4. Added privacy regression test:
   - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/tests/test_create_service_privacy_controls.py`
   - New test validates:
     - file with PII is rejected (`422`)
     - location details are returned (`line 2`)
     - no ingest job is created for that upload

## Commands Executed
1. Consolidated API verification:
```bash
docker compose -f /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/docker-compose.generated.yml \
  --env-file /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/.env \
  --env-file /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/.env.secrets \
  exec -T service-gen-api /app/.venv/bin/python -m pytest -q \
  /app/tests/test_create_service_privacy_controls.py \
  /app/tests/test_create_service_security_controls.py \
  /app/tests/test_create_service_agent_security.py \
  /app/tests/test_gateway_policy_middleware.py \
  /app/tests/test_service_suggest_endpoint.py
```
Result: `17 passed`

2. Direct-ingest e2e regression:
```bash
docker compose -f /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/docker-compose.generated.yml \
  --env-file /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/.env \
  --env-file /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/.env.secrets \
  exec -T playwright-test sh -lc \
  'cd /work && pnpm exec playwright test tests/e2e/create-service-playground-flow.spec.ts --grep "step 3 direct-ingest works without clicking Add" --reporter=line --workers=1 --output=/tmp/pw-output --trace=off'
```
Result: `1 passed`

3. SaaS typecheck:
```bash
docker compose -f /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/docker-compose.generated.yml \
  --env-file /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/.env \
  --env-file /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/.env.secrets \
  exec -T service-gen-saas sh -lc 'cd /app && pnpm -s typecheck'
```
Result: pass

## Artifacts Updated
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/af-iclme/layers/ideas/create_service/Privacy/test_plan.md`
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/af-iclme/layers/ideas/create_service/Privacy/test_report.md`
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/af-iclme/layers/ideas/create_service/Privacy/traceability_report.md`

## Outcome
- Privacy phase completed with enforced pre-upload PII detection and blocking behavior.
- Users now receive actionable location feedback when upload is rejected.
