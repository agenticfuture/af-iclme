# Create Service - Security Layer Test Plan
Version: 1.2.0
Layer: Security (L5)
Idea: create_service
Status: Executed

## 1. Objective
Validate implemented security controls for create_service and related ingestion/deployment edges.

## 2. Scope
In scope:
- Auth enforcement through gateway policy
- Auth enforcement on service + job ingestion/execute endpoints
- SSRF blocking in URL ingestion
- Ingestion payload/extension/malware baseline guards
- Prompt input hardening for suggestion path
- Playground iframe sandboxing
- SaaS anti-iframe response headers
- Signed embed scope token validation for bot runtime
- Anonymous actor cookie binding + tamper isolation for embed/public chat

Out of scope in this pass:
- Multi-tenant identity-provider integration tests with externally issued role claims (staging/prod realm validation)

## 3. Test Inventory
- `/app/tests/test_create_service_security_controls.py`
- `/app/tests/test_gateway_policy_middleware.py`
- `/app/tests/test_service_suggest_endpoint.py`
- `/app/tests/test_create_service_agent_security.py`
- `/app/tests/test_create_service_flow_contract.py`
- `/app/tests/test_runtime_config_validation.py`
- `/work/tests/e2e/security-headers.spec.ts`
- `/work/tests/e2e/create-service-playground-flow.spec.ts` (sandbox assertions)
- `/app/scripts/test-chat-route-security-contract.ts`
- `/app/scripts/test-anonymous-actor-isolation-contract.ts`
- `/app/scripts/test-public-embed-chat-bridge-contract.ts`

## 4. Commands
```bash
docker compose -f docker-compose.generated.yml exec -T service-gen-api \
  /app/.venv/bin/python -m pytest -q \
  /app/tests/test_create_service_flow_contract.py \
  /app/tests/test_create_service_security_controls.py \
  /app/tests/test_gateway_policy_middleware.py \
  /app/tests/test_service_suggest_endpoint.py \
  /app/tests/test_create_service_agent_security.py \
  /app/tests/test_runtime_config_validation.py

docker compose -f docker-compose.generated.yml exec -T playwright-test \
  sh -lc 'cd /work && pnpm exec playwright test tests/e2e/security-headers.spec.ts --reporter=line --workers=1 --output=/tmp/pw-output --trace=off'

docker compose -f docker-compose.generated.yml exec -T playwright-test \
  sh -lc 'cd /work && pnpm exec playwright test tests/e2e/create-service-playground-flow.spec.ts --grep "wizard finish redirects to playground and both embed modes are functional" --reporter=line --workers=1 --output=/tmp/pw-output --trace=off'

docker compose -f docker-compose.generated.yml exec -T service-gen-ai-chatbot-e2e \
  sh -lc 'cd /app && ./node_modules/.bin/tsx scripts/test-chat-route-security-contract.ts'

docker compose -f docker-compose.generated.yml exec -T service-gen-ai-chatbot-e2e \
  sh -lc 'cd /app && ./node_modules/.bin/tsx scripts/test-anonymous-actor-isolation-contract.ts'

docker compose -f docker-compose.generated.yml exec -T \
  -e SERVICEGEN_SCOPE_JSON="{\"service_id\":\"8ec3ebbc-5046-4fad-8370-f8fac5014f8d\",\"tenant_id\":\"3cd153b2-1bbf-478a-9019-cb3de47a2966\",\"org_id\":\"01cc21bb-db5c-46c8-970d-9e4ba8fe2fc0\"}" \
  -e SERVICEGEN_PUBLIC_AVAILABILITY_JSON="{\"allowed\":true,\"reason\":\"public_allowed\",\"hide_widget\":false,\"deployment_status\":\"published\",\"billing_status\":\"paid\",\"access_scope\":\"public_embed\"}" \
  service-gen-ai-chatbot-e2e \
  sh -lc 'cd /app && ./node_modules/.bin/tsx scripts/test-public-embed-chat-bridge-contract.ts'
```

## 5. Acceptance Criteria
- Security suite passes with no failing controls in implemented scope
