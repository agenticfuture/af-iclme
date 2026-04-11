# Tenant Registration - Product Layer Test Plan
Version: 1.0.0
Layer: Product (L1)
Idea: tenant_registration
Status: Executed (this plan corresponds to the validated run documented below)

## 1. Objective
Validate the tenant registration product behavior end-to-end across SaaS UI, Keycloak redirects/callback, ServiceGen API tenant endpoints, and Postgres persistence.

## 2. Scope
In scope:
- Tenant domain product behavior (functional workflow path in current implementation)
- SaaS browser flows and onboarding UX
- Real Keycloak UI redirect/callback path
- DB persistence of tenant registration and tenant/user projections
- Dashboard user identity rendering and logout menu presence after callback

Out of scope (tracked in implementation plan backlog):
- Full enterprise CI/CD generation rollout
- Full cloud runbooks/SLOs/alerts
- Full OPA policy coverage for all advanced decision points
- Full mailbox/email verification automation path in browser e2e

## 3. Environments / Runtime
- Docker Compose local runtime (`docker-compose.generated.yml`)
- Services used: `service-gen-saas`, `service-gen-api`, `sg_keycloak`, `postgres`, `playwright-test`
- Real Keycloak realm/client config: `saas-servicegen`

## 4. Product Test Inventory
### 4.1 Backend/Product Functional Tests (tenant domain)
- `capabilities/tenant/tests/*` (current tenant domain suite; includes some security-oriented tests, accepted in Product regression run for broad regression coverage)

### 4.2 SaaS Product Validation (compile/runtime)
- TypeScript compile:
  - `ui-apps/service-gen-saas` (`pnpm exec tsc --noEmit`)

### 4.3 SaaS Browser E2E (Playwright)
- `ui-apps/service-gen-saas/tests/e2e/home-auth-redirects.spec.ts`
- `ui-apps/service-gen-saas/tests/e2e/register-keycloak-redirect.spec.ts`
- `ui-apps/service-gen-saas/tests/e2e/tenant-onboarding.spec.ts`
- `ui-apps/service-gen-saas/tests/e2e/full-signup-to-db-save.spec.ts`

## 5. Acceptance Criteria
- All listed Product tests pass
- Full signup browser flow reaches SaaS dashboard successfully after real Keycloak signup
- Dashboard user menu shows real user name and `Logout`
- Onboarding persists tenant registration and linked projections in DB

## 6. Execution Commands (validated)
### Backend tenant suite (API container)
`docker exec service-gen-api sh -lc 'cd /app && PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 /app/.venv/bin/python -m pytest capabilities/tenant/tests -q'`

### SaaS compile check
`docker exec service-gen-saas sh -lc 'cd /app && pnpm exec tsc --noEmit --pretty false'`

### SaaS e2e specs (Playwright runner)
`docker exec playwright-test sh -lc 'cd /work && export NODE_PATH=$(npm root -g) PLAYWRIGHT_OUTPUT_DIR=/tmp/pw-output PLAYWRIGHT_ARTIFACT_DIR=/tmp/pw-artifacts && timeout 300s playwright test tests/e2e/home-auth-redirects.spec.ts --reporter=line --workers=1 --output=/tmp/pw-output'`

`docker exec playwright-test sh -lc 'cd /work && export NODE_PATH=$(npm root -g) PLAYWRIGHT_OUTPUT_DIR=/tmp/pw-output PLAYWRIGHT_ARTIFACT_DIR=/tmp/pw-artifacts && timeout 300s playwright test tests/e2e/register-keycloak-redirect.spec.ts --reporter=line --workers=1 --output=/tmp/pw-output'`

`docker exec playwright-test sh -lc 'cd /work && export NODE_PATH=$(npm root -g) PLAYWRIGHT_OUTPUT_DIR=/tmp/pw-output PLAYWRIGHT_ARTIFACT_DIR=/tmp/pw-artifacts && timeout 300s playwright test tests/e2e/tenant-onboarding.spec.ts --reporter=line --workers=1 --output=/tmp/pw-output'`

`docker exec playwright-test sh -lc 'cd /work && export NODE_PATH=$(npm root -g) PLAYWRIGHT_OUTPUT_DIR=/tmp/pw-output PLAYWRIGHT_ARTIFACT_DIR=/tmp/pw-artifacts && timeout 600s playwright test tests/e2e/full-signup-to-db-save.spec.ts --reporter=line --workers=1 --output=/tmp/pw-output'`
