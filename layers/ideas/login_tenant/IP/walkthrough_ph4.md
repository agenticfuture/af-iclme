# login_tenant - Walkthrough Phase 4

Date: 2026-02-26

## Phase goal
Add privacy controls for login operations:
- ensure login security events avoid raw email leakage
- add retention purge entrypoint for security events (24-month default)

## Code updates
- Added security-event retention purge in memory store:
  - `ServiceGen/capabilities/tenant/shared/memory_store.py`
  - New method: `purge_security_events_older_than_days(retention_days)`
- Added security-event retention purge in SQL store:
  - `ServiceGen/capabilities/tenant/adapters/db/sql_store.py`
  - New method: `purge_security_events_older_than_days(retention_days)`
- Added tenant API maintenance method + HTTP endpoint:
  - `ServiceGen/capabilities/tenant/factory.py`
  - New API method: `purge_security_events(retention_days, ctx)`
  - New route: `POST /api/tenant/v1/internal/purge-security-events?retention_days=730`
  - Default retention set to 730 days (24 months)
- Factory contract expanded:
  - `ServiceGen/capabilities/tenant/tests/unit/test_factory_contract.py`
  - `ServiceGen/capabilities/tenant/ci/scripts/validate_factory_contract.py`
  - Added required method: `purge_security_events`

## Tests added
- `ServiceGen/capabilities/tenant/tests/unit/test_login_privacy_retention.py`
  - verifies login failure security events do not persist raw email
  - verifies retention purge removes only stale events beyond retention window

## Validation executed (inside docker service-gen-api)
- `python -m pytest -q capabilities/tenant/tests/unit/test_login_privacy_retention.py capabilities/tenant/tests/unit/test_factory_contract.py`
  - Result: `4 passed`
- `python -m capabilities.tenant.ci.scripts.validate_factory_contract`
  - Result: `factory contract validation ok`
- `python -m pytest -q capabilities/tenant/tests/unit`
  - Result: `23 passed`

## Notes
- Retention endpoint is maintenance/internal and defaults to 24-month retention as required.
- Existing compose warning about `ENCRYPTION_KEY` remains; unrelated to these tests but should be set for broader security completeness.
