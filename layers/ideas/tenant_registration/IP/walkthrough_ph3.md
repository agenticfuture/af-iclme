# Tenant Registration - Phase 3 Walkthrough (Keycloak + Webhook Activation Skeleton)

## Scope
- Added Keycloak adapter skeleton and webhook validator skeleton under the `tenant` domain.
- Added `verify_email_webhook` cap and route.
- Extended in-memory registration flow to support:
  - Keycloak provisioning markers
  - email verification transition
  - tenant activation transition
  - rollback marker (skeleton)

## Files Implemented (Phase 3)
- `capabilities/tenant/adapters/keycloak/__init__.py`
- `capabilities/tenant/adapters/keycloak/identity_adapter.py`
- `capabilities/tenant/adapters/keycloak/webhook_validator.py`
- `capabilities/tenant/caps/verify_email_webhook/entities.py`
- `capabilities/tenant/caps/verify_email_webhook/tasks.py`
- `capabilities/tenant/caps/verify_email_webhook/workflow.py`
- `capabilities/tenant/caps/verify_email_webhook/handler.py`
- `capabilities/tenant/shared/memory_store.py` (activation + provisioning helpers)
- `capabilities/tenant/factory.py` (webhook route + activation logic wiring)
- `capabilities/tenant/tests/unit/test_phase3_webhook_activation.py`

## Docker Runtime Validation (API container)
All checks executed against `service-gen-api` using the container venv interpreter style:

```bash
docker exec service-gen-api sh -lc 'cd /app && PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 /app/.venv/bin/python -m pytest capabilities/tenant/tests/unit/test_phase3_webhook_activation.py -q'
```

Expected/observed result:
- Phase 3 webhook/activation unit test passed

## Route Smoke Validation Performed
Validated registration -> pending verification -> webhook verify -> activated status flow in-container using the FastAPI app object.

Checked endpoints:
- `POST /api/tenant/v1/register`
- `POST /api/tenant/v1/verify-email-webhook`
- `GET /api/tenant/v1/registrations/{id}`

Observed behavior:
- Registration returns `EmailVerificationPending`
- Webhook transitions to `TenantActivated`
- Status endpoint returns `active` with activation state

## Notes
- Keycloak adapter and webhook validation are skeleton implementations at this phase (no live Keycloak calls yet).
- Prefect/orchestrator-grade workflow completion and rollback compensation remain to be deepened in later phases.
