# Create Service - Security Layer Test Report
Version: 1.2.0
Layer: Security (L5)
Idea: create_service
Status: PASS

## 1. Execution Summary
- API security/contract suite: `28 passed`
- Browser security checks: `3 passed`
- Bot route security contracts: `2 passed`
- Anonymous actor isolation contracts: `1 passed`
- Public embed bridge contract: `1 passed`

## 2. What Was Validated
- Auth-required gateway enforcement for protected service routes
- Auth-required gateway enforcement for job ingestion and execute routes
- Role-gated create-service authorization (`tenant_admin` / `admin` / `owner`)
- SSRF restricted URL rejection for localhost/metadata IPs
- URL-content privacy scan before URL ingest enqueue (PII blocks ingestion)
- URL scan operational failure path mapped to explicit API error (`url_scan_unavailable`)
- File ingestion size/extension/malware baseline checks
- Prompt seed sanitization hardening path
- Prompt visibility control (hidden from `human_agent`, visible to admin scopes)
- Centralized runtime security/privacy config + startup validation
- Middleware policy path behavior and correlation propagation
- SaaS anti-iframe headers and playground iframe sandbox attributes
- Human-agent service-scope isolation (assigned service allowed, unassigned denied)
- Signed embed scope token validation and mismatch rejection in bot runtime
- Signed anonymous actor cookie issuance, reuse, tamper isolation, and legacy-cookie migration
- Public embed chat bridge preserves scope and cookie binding while persisting to chatbot DB

## 3. Evidence Command
- `pytest -q /app/tests/test_create_service_flow_contract.py /app/tests/test_create_service_security_controls.py /app/tests/test_create_service_agent_security.py /app/tests/test_create_service_privacy_controls.py /app/tests/test_gateway_policy_middleware.py /app/tests/test_service_suggest_endpoint.py /app/tests/test_runtime_config_validation.py`
- `pnpm exec playwright test tests/e2e/create-service-playground-flow.spec.ts tests/e2e/security-headers.spec.ts --reporter=line --workers=1 --output=/tmp/pw-output --trace=off`
- `./node_modules/.bin/tsx scripts/test-chat-route-security-contract.ts`
- `./node_modules/.bin/tsx scripts/test-anonymous-actor-isolation-contract.ts`
- `SERVICEGEN_SCOPE_JSON=... SERVICEGEN_PUBLIC_AVAILABILITY_JSON=... ./node_modules/.bin/tsx scripts/test-public-embed-chat-bridge-contract.ts`

## 4. Residual Risks
- Tenant/org IDs are still resolved through current local realm model for this cap (default test realm wiring), so strict claim-derived tenant scoping is a platform-level follow-up outside this security pass.
