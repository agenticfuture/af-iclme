# Create Service - Product Layer Test Plan
Version: 1.0.0
Layer: Product (L1)
Idea: create_service
Status: Executed

## 1. Objective
Validate functional behavior of the 5-step create-service flow and its backend contracts.

## 2. Scope
In scope:
- Service draft + chatbot draft autosave behavior
- Suggest endpoint behavior
- Step 3/4 persistence contract behavior
- SaaS wizard compile correctness

Out of scope for this pass:
- Full browser e2e for playground render/toggle and finish redirect visual assertions

## 3. Test Inventory
- `/app/tests/test_create_service_flow_contract.py`
- `/app/tests/test_service_suggest_endpoint.py`
- `ui-apps/service-gen-saas/tests/e2e/create-service-playground-flow.spec.ts`
- `ui-apps/service-gen-saas/tests/e2e/create-service-playground-flow.spec.ts` (direct-ingest case)
- SaaS compile check via `pnpm -s typecheck`

## 4. Commands
```bash
docker compose -f docker-compose.generated.yml exec -T service-gen-api \
  /app/.venv/bin/python -m pytest -q \
  /app/tests/test_create_service_flow_contract.py \
  /app/tests/test_service_suggest_endpoint.py


docker compose -f docker-compose.generated.yml exec -T service-gen-saas \
  sh -lc 'cd /app && pnpm -s typecheck'

docker compose -f docker-compose.generated.yml exec -T playwright-test \
  sh -lc 'cd /work && export PLAYWRIGHT_OUTPUT_DIR=/tmp/pw-output PLAYWRIGHT_ARTIFACT_DIR=/tmp/pw-artifacts && \
  pnpm exec playwright test tests/e2e/create-service-playground-flow.spec.ts --reporter=line --workers=1 --output=/tmp/pw-output'
```

## 5. Acceptance Criteria
- All listed product tests pass
- SaaS typecheck passes
