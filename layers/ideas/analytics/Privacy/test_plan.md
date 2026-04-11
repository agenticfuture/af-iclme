# Analytics Privacy Test Plan

## Scope
Privacy verification for analytics exports and analytics responses covering:
- aggregate-only exports
- no raw message payload leakage
- no encrypted column leakage
- no sender/user payload leakage from analytics exports

## Test Files
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/tests/test_analytics_privacy_contract.py`
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/tests/test_analytics_export_contract.py`

## Privacy Objectives
1. Analytics exports do not expose raw message bodies.
2. Analytics exports do not expose encrypted message storage columns.
3. Analytics exports remain aggregate/summary oriented.
4. Service analytics exports expose counts and metadata only.

## Executed Strategy
- non-browser contract execution in the normal `service-gen-api` container
- sequential file-by-file execution to keep runtime stable
- no browser E2E in this phase
