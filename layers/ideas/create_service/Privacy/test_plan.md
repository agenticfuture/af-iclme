# Create Service - Privacy Layer Test Plan
Version: 1.1.0
Layer: Privacy (L4)
Idea: create_service
Status: Executed

## 1. Objective
Validate implemented privacy controls for create_service ingestion, agent handling, and audit traceability.

## 2. Scope
In scope:
- Pre-upload PII scan gate in Data Sources step (hard block before storage/job enqueue)
- PII redaction prior to embeddings persistence
- Agent credential secure storage (hash only)
- Audit event persistence for key service lifecycle actions

Out of scope in this pass:
- Region-level data residency enforcement with dynamic region routing
- Full long-term retention lifecycle execution (policy defined; purge scheduler out of this cap)

## 3. Test Inventory
- `/app/tests/test_create_service_privacy_controls.py`
- `/app/tests/test_create_service_agent_security.py`
- `/app/tests/test_runtime_config_validation.py`
- `/work/tests/e2e/create-service-playground-flow.spec.ts` (direct-ingest path remains green)

## 4. Commands
```bash
docker compose -f docker-compose.generated.yml exec -T service-gen-api \
  /app/.venv/bin/python -m pytest -q \
  /app/tests/test_create_service_privacy_controls.py \
  /app/tests/test_create_service_agent_security.py \
  /app/tests/test_runtime_config_validation.py

docker compose -f docker-compose.generated.yml exec -T service-gen-saas \
  sh -lc 'cd /app && pnpm -s typecheck'
```

## 5. Acceptance Criteria
- Privacy suite passes in implemented scope with:
  - no plaintext credential persistence
  - PII uploads rejected pre-storage with file/location feedback
