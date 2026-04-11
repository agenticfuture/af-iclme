# Analytics Security Traceability Report

## Controls To Tests
- Auth required on analytics routes:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/tests/test_analytics_security_contract.py::test_analytics_routes_require_authentication`
- Tenant scope mismatch rejection:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/tests/test_analytics_security_contract.py::test_analytics_rejects_tenant_scope_mismatch`
- Org scope mismatch rejection:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/tests/test_analytics_security_contract.py::test_analytics_rejects_org_scope_mismatch`
- Export route scope enforcement:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/tests/test_analytics_security_contract.py::test_analytics_export_rejects_cross_tenant_scope`

## Execution Result
- Executed in normal `service-gen-api` container
- Aggregate result:
  - `4 passed in 64.96s`
