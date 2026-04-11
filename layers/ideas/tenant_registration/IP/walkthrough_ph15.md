# Phase 15 Walkthrough - Full signup to DB save verification (real browser + DB evidence)

## Objective
Validate a continuous browser flow from SaaS `/register` through Keycloak registration UI and onward to onboarding DB persistence, then confirm DB rows exist in Postgres.

## Test executed
- Playwright spec: `ui-apps/service-gen-saas/tests/e2e/full-signup-to-db-save.spec.ts`
- Runner: `playwright-test` Docker service

Command used:
```bash
docker exec playwright-test sh -lc 'cd /work && export NODE_PATH=$(npm root -g) && timeout 480s playwright test tests/e2e/full-signup-to-db-save.spec.ts --reporter=line --workers=1'
```

## Debug evidence (key checkpoints)
From `ui-apps/service-gen-saas/test-results/full-signup-to-db-save.debug.log`:
- `saas_register_loaded`
- `saas_register_submit_clicked`
- `keycloak_url:https://auth.servicegen.local/realms/saas-servicegen/.../registrations?...`
- `keycloak_form_ready`
- `keycloak_submit_clicked`
- `saas_returned:https://saas.servicegen.local/login?error=server_error`
- `onboarding_create_loaded`
- `onboarding_submit_clicked`
- `onboarding_verify_loaded`
- `tenant_status:pending:EmailVerificationPending`

## Result artifact
`ui-apps/service-gen-saas/test-results/full-signup-to-db-save.result.json`

Captured values:
- `registrationId`: `e6b9a861-fb3b-4a01-a0db-330ec27c4b6d`
- `tenantId`: `0c9dfac2-d6f7-4290-9124-6c87cb8472f6`
- `registrationStatus`: `pending`
- `currentState`: `EmailVerificationPending`

## Postgres verification (real DB)
Executed in `postgres` container:
```bash
psql -U postgres -d servicegen -Atc "
select id,status,current_state,tenant_id,org_name,email_hash from tenant_reg.registration_requests where id='e6b9a861-fb3b-4a01-a0db-330ec27c4b6d';
select id,status from core.tenants where id='0c9dfac2-d6f7-4290-9124-6c87cb8472f6';
"
```

Verified rows:
- `tenant_reg.registration_requests` exists with:
  - status=`pending`
  - current_state=`EmailVerificationPending`
  - tenant_id matches result artifact
- `core.tenants` exists with:
  - id matches result artifact tenantId
  - status=`provisioning`

## Important finding
The browser flow returns to `https://saas.servicegen.local/login?error=server_error` after Keycloak registration submit, then proceeds into onboarding. This means the DB-save proof is real, but the auth callback/session establishment path still has a live defect and is not yet a clean end-to-end authenticated success path.

## Conclusion
- Continuous browser flow reached Keycloak registration UI and submitted real data.
- Tenant registration and tenant projection were persisted in the real Postgres DB.
- SaaS auth callback remains defective (`/login?error=server_error`) and must be fixed before claiming a fully clean signup -> callback -> onboarding chain.
