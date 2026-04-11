# Create Service - Privacy Layer Test Report
Version: 1.1.0
Layer: Privacy (L4)
Idea: create_service
Status: PASS

## 1. Execution Summary
- Privacy API tests: `8 passed`
- Supporting create_service regression set: `28 passed`
- Browser create_service regression: `3 passed`
- SaaS typecheck: pass

## 2. What Was Validated
- Data Sources upload path performs pre-upload PII scan and blocks enqueue/storage on detection
- PII rejection returns file and location details for user feedback
- URL ingestion now fetches remote content and blocks queueing when PII is detected
- URL scan network/transport failures are surfaced as explicit non-queueing errors
- Redaction layer applies to ingested content before embedding writes
- Service audit actions are persisted for key workflow events
- Agent passwords are persisted as PBKDF2 hashes, never plaintext
- Agent API response omits password/hash fields

## 3. Evidence Command
- `pytest -q /app/tests/test_create_service_privacy_controls.py /app/tests/test_create_service_agent_security.py /app/tests/test_runtime_config_validation.py`
- `pytest -q /app/tests/test_create_service_flow_contract.py /app/tests/test_create_service_security_controls.py /app/tests/test_create_service_agent_security.py /app/tests/test_create_service_privacy_controls.py /app/tests/test_gateway_policy_middleware.py /app/tests/test_service_suggest_endpoint.py /app/tests/test_runtime_config_validation.py`
- `pnpm exec playwright test tests/e2e/create-service-playground-flow.spec.ts tests/e2e/security-headers.spec.ts --reporter=line --workers=1 --output=/tmp/pw-output --trace=off`
- `pnpm -s typecheck` (service-gen-saas)

## 4. Residual Risks
- Data residency policy (`Canada` routing) is specified but requires broader infra-level region controls not yet fully validated in this cap-local suite.
