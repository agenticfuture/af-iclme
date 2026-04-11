# Create Service - Product Layer Test Report
Version: 1.0.0
Layer: Product (L1)
Idea: create_service
Status: PASS (implemented product scope)

## 1. Execution Summary
- API product tests: `4 passed`
- SaaS typecheck: pass
- SaaS browser e2e (create-service to playground): pass (covered in smoke run)
- SaaS browser e2e (direct-ingest without Add): `1 passed`
- SaaS browser e2e smoke (`home-auth-redirects` + `create-service-playground-flow`): `4 passed`

## 2. Evidence
- API command executed in `service-gen-api` container:
  - `pytest -q /app/tests/test_create_service_flow_contract.py /app/tests/test_service_suggest_endpoint.py`
- SaaS command executed in `service-gen-saas` container:
  - `pnpm -s typecheck`
- Playwright command executed in `playwright-test` container:
  - `pnpm exec playwright test tests/e2e/create-service-playground-flow.spec.ts --grep "step 3 direct-ingest works without clicking Add" --reporter=line --workers=1 --output=/tmp/pw-output --trace=off`
  - `pnpm exec playwright test tests/e2e/home-auth-redirects.spec.ts tests/e2e/create-service-playground-flow.spec.ts --reporter=line --workers=1 --output=/tmp/pw-output --trace=off`

## 3. Notes
- Functional behavior for suggest and backend autosave contracts is validated.
- Finish redirect and playground tab behaviors are now validated by browser e2e.
- A product defect was fixed during this phase: create-service browser calls to `api.servicegen.local` lacked `credentials: "include"`, causing auth cookie omission and 401 on finish paths.
- Direct-ingest UI scenario is now captured with passing browser evidence (`1 passed` on targeted run).
