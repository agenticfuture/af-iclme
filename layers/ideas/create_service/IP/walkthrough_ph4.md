# Create Service - Phase 4 Walkthrough (Agent Credential Security Wiring)

Date: 2026-02-28

## Scope executed
- Added API wiring for assigned human agents in create_service capability.
- Ensured plaintext agent credentials are never returned and only hashed credentials are persisted.
- Wired SaaS create-service finish flow to persist selected agents before deployment.

## Code changes
- `capabilities/service/caps/create_service/entities.py`
  - Added `AssignedAgentRequest`
  - Added `ServiceAgentsRequest`

- `capabilities/service/caps/create_service/workflow.py`
  - Added `upsert_service_agents_flow(...)`

- `capabilities/service/caps/create_service/handler.py`
  - Added `handle_upsert_service_agents(...)`

- `capabilities/service/caps/create_service/api.py`
  - Added `POST /api/service/services/{service_id}/agents`
  - Added input validation for agent fields/email normalization
  - Endpoint uses existing secure DB function (`upsert_service_agents`) which hashes passwords

- `ui-apps/service-gen-saas/shared/routes.ts`
  - Added `ROUTES.SERVICE_ASSIGN_AGENTS(serviceId)`

- `ui-apps/service-gen-saas/app/dashboard/services/new/page.tsx`
  - On Finish, mapped selected assigned agents and called backend assign-agents route before deploy

- `app/ingress/api/tests/test_create_service_agent_security.py`
  - Added test validating:
    - assign agents endpoint works under auth
    - response never returns plaintext or hash
    - DB stores hashed password (`pbkdf2_sha256$...`) and not plaintext

## Validation commands run
1. API test suite slice
```bash
docker compose -f docker-compose.generated.yml exec -T service-gen-api /app/.venv/bin/python -m pytest -q \
  /app/tests/test_create_service_agent_security.py \
  /app/tests/test_create_service_flow_contract.py \
  /app/tests/test_create_service_security_controls.py \
  /app/tests/test_create_service_privacy_controls.py
```
Result: `8 passed`

2. SaaS typecheck
```bash
docker compose -f docker-compose.generated.yml exec -T service-gen-saas sh -lc 'cd /app && pnpm -s typecheck'
```
Result: pass

## Outcome
- Agent assignment in create-service is now persisted via backend API.
- Agent passwords are hashed on persistence and never returned by API.
- Wizard finish flow now includes backend persistence of selected agents.
