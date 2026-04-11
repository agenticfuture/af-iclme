# Create Service - Phase 13 Walkthrough
Date: 2026-03-02
Idea: `create_service`
Layers: Security + Privacy hardening follow-up

## Requested Scope Executed
1. Keep focus on tenant/org/service isolation (residency deferred).
2. Centralize security/privacy operational config and validate.
3. Run full create_service cross-layer verification.
4. Harden operational scan failures with explicit behavior.
5. Finalize reports and walkthrough artifacts.

## Implemented Changes
### A) Config centralization + startup validation
- Added runtime config registry:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/policy/runtime_config.py`
- Wired startup validation in API:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/main.py`
- Wired config consumption into:
  - JWT session decode path: `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/policy/gateway_policy.py`
  - Human-agent password pepper: `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/service/caps/create_service/tasks.py`
  - Ingestion thresholds/timeouts: `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/job/caps/create_job/workflow.py`

### B) Role and prompt protection hardening
- Expanded route-level role gates for service and job endpoints:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/service/caps/create_service/api.py`
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/job/caps/create_job/api.py`
- Prompt exposure control:
  - Prompt hidden for lower-privileged role (`human_agent`) in list/get responses.
  - Same file: `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/service/caps/create_service/api.py`

### C) URL scan operational hardening
- Added explicit URL scan exception path (`UrlContentScanError`) and API mapping:
  - `url_scan_unavailable` returned with `502` and clear message.
  - Files:
    - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/job/caps/create_job/workflow.py`
    - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/job/caps/create_job/api.py`

## Test Updates (Real data/flows)
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/tests/test_create_service_security_controls.py`
  - Added chatbot role gate test.
  - Added suggest role gate test.
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/tests/test_create_service_agent_security.py`
  - Added prompt visibility test (admin sees, human agent does not).
  - Added list route prompt-redaction check for human agent.
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/tests/test_create_service_privacy_controls.py`
  - Added URL-content PII block test (real URL response content).
  - Added clean URL allow test (real URL response content).
  - Added URL scan failure test (`.invalid` domain).
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/tests/test_runtime_config_validation.py`
  - Added runtime-config validation tests (strict/non-strict/threshold bounds).
- Updated auth-role fixtures in:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/tests/test_create_service_flow_contract.py`
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/tests/test_service_suggest_endpoint.py`

## Verification Commands + Results
1. Full API cross-layer regression:
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
  /app/tests/test_service_suggest_endpoint.py \
  /app/tests/test_runtime_config_validation.py
```
Result: `28 passed`

2. Browser regression:
```bash
docker compose -f /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/docker-compose.generated.yml \
  --env-file /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/.env \
  --env-file /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/.env.secrets \
  exec -T playwright-test sh -lc \
  'cd /work && pnpm exec playwright test tests/e2e/create-service-playground-flow.spec.ts tests/e2e/security-headers.spec.ts --reporter=line --workers=1 --output=/tmp/pw-output --trace=off'
```
Result: `3 passed`

3. SaaS typecheck:
```bash
docker compose -f /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/docker-compose.generated.yml \
  --env-file /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/.env \
  --env-file /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/.env.secrets \
  exec -T service-gen-saas sh -lc 'cd /app && pnpm -s typecheck'
```
Result: pass

## Artifact Updates
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/af-iclme/layers/ideas/create_service/Security/test_plan.md`
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/af-iclme/layers/ideas/create_service/Security/test_report.md`
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/af-iclme/layers/ideas/create_service/Security/traceability_report.md`
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/af-iclme/layers/ideas/create_service/Privacy/test_plan.md`
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/af-iclme/layers/ideas/create_service/Privacy/test_report.md`
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/af-iclme/layers/ideas/create_service/Privacy/traceability_report.md`

## Outcome
- Requested steps (1–5) are executed, excluding residency by explicit instruction.
- Cross-layer create_service security/privacy verification is fully green on current local stack.
