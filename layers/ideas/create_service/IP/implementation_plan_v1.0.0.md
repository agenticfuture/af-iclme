# Create Service Implementation Plan v1.0.0

## Scope
Implement `create_service` end-to-end against idea specs for product, security, privacy, and risk controls.

## Phase 1 (Product)
1. Add missing backend suggestion endpoint (`POST /api/service/suggest`).
2. Keep wizard step autosave behavior reliable for service/chatbot drafts.
3. Validate direct-ingest queue + finish execution and redirect to playground.
4. Add product tests for suggest, autosave IDs, deploy redirect contract.

## Phase 2 (Security)
1. Enforce gateway auth policy and tenant/org scoped access for service APIs.
2. Add ingestion security checks (size limit, SSRF URL guard, malware hook).
3. Harden playground iframe sandbox + CSP restrictions.
4. Add security tests for cross-tenant isolation, SSRF blocking, sandbox, RBAC.

## Phase 3 (Privacy)
1. Add PII redaction stage before embedding persistence.
2. Ensure secure handling of prompts/agent credentials and restricted exposure.
3. Emit auditable events for create/config/update/deploy.
4. Add privacy tests for redaction, credential secrecy, audit trail, tenant/org tagging.

## Phase 4 (Risk)
1. Add prompt-injection guardrails in suggestion + deployment context.
2. Add draft cleanup strategy for stale records.
3. Add citation/source integrity checks in retrieval pipeline.
4. Add risk mitigation tests mapped to risk IDs.

## Traceability
All implemented files and tests will be mapped to IDs from:
- requirements_spec(.md/.yml)
- security_spec(.md/.yml)
- privacy_spec(.md/.yml)
- risks_spec(.md/.yml)

## Notes
- `workflow.md`/`workflow.yml` were not present in idea folder at planning time.
- Implementation will proceed against available specs and test-case docs.
