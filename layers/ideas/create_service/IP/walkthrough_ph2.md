# Create Service - Walkthrough Phase 2

Date: 2026-02-28

## Product flow hardening completed

### 1) Step 2 autosave idempotency (chatbot)
- Updated `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/service/caps/create_service/tasks.py`:
  - `create_chatbot_for_service(...)` now updates the existing chatbot draft for the same service instead of creating duplicates.

### 2) Finish deploy idempotency
- Updated `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/service/caps/create_service/tasks.py`:
  - `trigger_deployment(...)` now returns existing LIVE deployment for same service/chatbot when present.

### 3) Replaced simulated endpoints with real persistence
- Updated `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/service/caps/create_service/api.py`:
  - `POST /api/service/services/{id}/data-sources` now persists `data_sources` into service config.
  - `POST /api/service/services/{id}/channels` now persists channels (replace-all semantics).

### 4) RLS compatibility fix for service write paths
- Updated service task/write paths to execute under db scope + RLS:
  - `create_service_draft`, `create_chatbot_for_service`, `trigger_deployment`
  - and update endpoints for data sources/channels.

## Security controls completed

### 1) Service endpoint auth enforcement
- Added gateway auth policy to create/list/get/update/deploy/status endpoints in:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/service/caps/create_service/api.py`

### 2) SSRF URL guard for URL ingestion
- Updated `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/job/caps/create_job/api.py`:
  - Added URL validator that rejects localhost/private/link-local/reserved IP targets.
  - Returns `400 Invalid or restricted URL`.

### 3) File ingestion guards
- Updated `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/job/caps/create_job/workflow.py`:
  - Max file size guard (`INGEST_FILE_MAX_MB`, default 50MB).
  - Extension allowlist (`.pdf,.docx,.txt,.md` by default).
  - EICAR signature rejection hook (`Failed malware scan`).

### 4) Job realm resolution fix under RLS
- Updated `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/job/caps/create_job/api.py`:
  - `_resolve_service_realm(...)` now applies scoped fallback lookup for local RLS-enabled environment.

### 5) Playground iframe isolation
- Updated `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-saas/components/chatbot-embed.tsx`:
  - Added `sandbox="allow-scripts allow-same-origin allow-forms"` to iframe mode and JS-script-generated iframe.

## Tests added/updated
- Added `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/tests/test_create_service_flow_contract.py`
  - chatbot autosave idempotency
  - step 3/4 POST persistence
- Added `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/tests/test_create_service_security_controls.py`
  - SSRF blocklist checks
  - file size limit rejection
- Updated `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/tests/test_service_suggest_endpoint.py`
  - now uses signed JWT headers after auth enforcement.

## Validation runs

### Backend tests
Command:
```bash
docker compose -f docker-compose.generated.yml exec -T service-gen-api \
  /app/.venv/bin/python -m pytest -q \
  /app/tests/test_create_service_security_controls.py \
  /app/tests/test_create_service_flow_contract.py \
  /app/tests/test_service_suggest_endpoint.py \
  /app/tests/test_gateway_policy_middleware.py
```
Result:
- `11 passed`

### Frontend typecheck
Command:
```bash
docker compose -f docker-compose.generated.yml exec -T service-gen-saas sh -lc 'cd /app && pnpm -s typecheck'
```
Result:
- pass
