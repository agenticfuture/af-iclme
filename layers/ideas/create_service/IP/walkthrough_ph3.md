# Create Service - Walkthrough Phase 3 (Privacy)

Date: 2026-02-28

## Privacy controls implemented

### 1) PII redaction before embedding storage (PR-SERV-001)
- Updated `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/job/caps/create_job/tasks.py`
  - Added `redact_pii_text(...)` for email, SSN, SIN masking.
  - In `_execute_ingest_file_job(...)`, text is redacted before chunking/embedding.
  - Added metadata flag `redaction_applied: true` in stored embedding metadata.

### 2) Audit event persistence for service flow (PR-SERV-003)
- Updated `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/service/caps/create_service/api.py`
  - Added `_log_audit_event(...)` helper (writes to `audit.access_log`).
  - Logged events on key actions:
    - `CREATE_SERVICE`
    - `CONFIGURE_BOT`
    - `ADD_DATASOURCE`
    - `DEPLOY_SERVICE`

### 3) Tenant/org scope traceability for ingestion jobs (PR-SERV-004 from test mapping)
- Verified and retained tenant/org linkage via job rows and service realm resolution.

## Tests added
- Added `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/tests/test_create_service_privacy_controls.py`
  - `test_redact_pii_text_masks_email_and_identifiers`
  - `test_service_flow_writes_audit_events`
  - `test_ingest_job_persists_tenant_org_scope_metadata`

## Validation run
Command:
```bash
docker compose -f docker-compose.generated.yml exec -T service-gen-api \
  /app/.venv/bin/python -m pytest -q \
  /app/tests/test_create_service_privacy_controls.py \
  /app/tests/test_create_service_security_controls.py \
  /app/tests/test_create_service_flow_contract.py \
  /app/tests/test_service_suggest_endpoint.py
```
Result:
- `9 passed`

## Notes
- Agent credential hashing control (`PR-SERV-002`) is not currently implemented in this specific create_service backend path because Step 5 agent creation in current flow is frontend-local and not persisted through a dedicated secured backend endpoint in this cap.
- Next step for full closure: move agent assignment to a backend endpoint and enforce hashed/ephemeral credential handling server-side.
