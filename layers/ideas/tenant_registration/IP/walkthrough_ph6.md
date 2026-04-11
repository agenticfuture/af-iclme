# Tenant Registration - Phase 6 Walkthrough (Real API Runtime Mount + Live Route Validation)

## Scope
- Mounted the `tenant` domain into the real `service-gen-api` runtime entrypoint.
- Restarted only `service-gen-api`.
- Validated live tenant endpoints against the actual running API process (not just test app scaffolds).
- Verified Docker service-to-service reachability from `service-gen-saas` to `service-gen-api`.

## Files Modified
- `app/ingress/api/main.py`
  - Added:
    - `from capabilities.tenant.factory import mount_tenant_domain`
    - `mount_tenant_domain(app)`

## Runtime Validation Steps (Docker)

### 1. Restart API container
```bash
docker restart service-gen-api
```

Observed:
- container restarted successfully

### 2. Check API logs (reloader stabilization)
```bash
docker logs --tail 200 service-gen-api
```

Observed:
- `Uvicorn running on http://0.0.0.0:8000`
- reloader bounced after file changes, then stabilized

### 3. Live tenant route smoke test inside `service-gen-api`
Executed a Python HTTP script in-container using `/app/.venv/bin/python` against:
- `GET /api/tenant/v1/health`
- `POST /api/tenant/v1/register`
- `GET /api/tenant/v1/registrations/{id}`
- `POST /api/tenant/v1/verify-email-webhook`
- `GET /api/tenant/v1/registrations/{id}` (post-activation)

Important correction during validation:
- Initial webhook payload failed with `422` (payload shape mismatch)
- Fixed by using the actual webhook schema fields and signing payload with `KeycloakWebhookValidator.sign(...)`

Observed live results:
- health: `200`
- register: `pending / EmailVerificationPending`
- webhook verify: `200`, `current_state=TenantActivated`
- status-after: `active / TenantActivated`, `tenant_id` populated

## Cross-Container Connectivity Validation (SaaS -> API)
Verified Docker service DNS path from `service-gen-saas`:

```bash
docker exec service-gen-saas sh -lc 'node -e "fetch(\"http://service-gen-api:8000/api/tenant/v1/health\").then(async r=>{console.log(r.status); console.log(await r.text())}).catch(e=>{console.error(e); process.exit(1)})"'
```

Observed:
- `200`
- tenant health JSON payload returned successfully

## Outcome
- The `tenant` domain is now mounted in the real API runtime.
- Live `/api/tenant/v1/*` routes are reachable and function through the current in-memory skeleton flow.
- `service-gen-saas` can reach the tenant API over Docker service networking (`service-gen-api:8000`), which matches the SaaS onboarding integration assumptions.

## Remaining Work (Next Phase)
- Replace in-memory registration store with DB-backed repositories and apply tenant domain migrations.
- Implement real Keycloak and OPA integrations beyond skeleton behavior.
- Add end-to-end onboarding/browser validation once API + Keycloak + webhook are fully wired.
