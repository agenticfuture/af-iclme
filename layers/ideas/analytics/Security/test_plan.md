# Analytics Security Test Plan

## Scope
Security verification for the analytics domain covering:
- authentication enforcement
- tenant/org scope isolation
- export access control
- query-scope mismatch rejection

## Test Files
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/tests/test_analytics_security_contract.py`
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/tests/test_analytics_overview_contract.py`
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/tests/test_analytics_services_contract.py`
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/tests/test_analytics_sources_contract.py`
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/tests/test_analytics_export_contract.py`

## Security Objectives
1. Analytics endpoints require authentication.
2. Authenticated tenant scope cannot be overridden by query parameters.
3. Authenticated org scope cannot be overridden by query parameters.
4. Export route enforces the same scope restrictions as read routes.
5. Analytics responses remain tenant/org scoped.

## Executed Strategy
- non-browser contract execution in the normal `service-gen-api` container
- sequential file-by-file execution to keep runtime stable
- no browser E2E in this phase
