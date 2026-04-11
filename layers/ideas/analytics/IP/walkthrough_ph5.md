# Walkthrough PH5 - Analytics Export Slice

## Scope
Implemented the export slice for the analytics domain:
- backend analytics export capability
- tenant/org/service-scoped JSON export bundle
- tenant/org/service-scoped CSV export datasets
- SaaS analytics export actions
- backend contract test for JSON and CSV export

## Files Added
- `capabilities/analytics/caps/export_report/entities.py`
- `capabilities/analytics/caps/export_report/functions.py`
- `capabilities/analytics/caps/export_report/workflow.py`
- `capabilities/analytics/caps/export_report/handler.py`
- `capabilities/analytics/caps/export_report/api.py`
- `app/ingress/api/tests/test_analytics_export_contract.py`

## Files Updated
- `capabilities/analytics/shared/entities.py`
- `capabilities/analytics/caps/get_top_sources/functions.py`
- `capabilities/analytics/factory.py`
- `ui-apps/service-gen-saas/shared/routes.ts`
- `ui-apps/service-gen-saas/app/api/analytics/[...path]/route.ts`
- `ui-apps/service-gen-saas/components/dashboard/analytics-dashboard.tsx`

## New Endpoint
`GET /api/analytics/v1/export`

### Query inputs
- `tenant_id` required via authenticated scope or query/header fallback
- `org_id` optional
- `service_id` optional
- `days` optional, default `14`, bounded `7..90`
- `limit` optional, default `20`, bounded `1..100`
- `format` required via query enum: `json | csv`
- `dataset` required via query enum: `services | sources | timeseries | overview_summary`

## Response Behavior
### JSON
Returns a full analytics bundle containing:
- `scope`
- `generated_at`
- `overview`
- `timeseries`
- `services`
- `sources`

### CSV
Returns an attachment response with `Content-Disposition` preserved through the SaaS proxy.
Supported datasets:
- `services`
- `sources`
- `timeseries`
- `overview_summary`

## Frontend
Added analytics actions for:
- `Export JSON`
- `Export CSV`

These actions are built from the tenant/org session scope already used by the analytics dashboard.

## Verification Performed
### Successful
- backend syntax compilation passed using `PYTHONPYCACHEPREFIX=/tmp/python-pyc-cache`
- frontend smoke check confirmed:
  - `ROUTES.ANALYTICS_EXPORT`
  - `Export JSON`
  - `Export CSV`
  - `content-disposition` forwarding
  - `/v1/export`
  are present in the SaaS and backend code paths

### Pending environment-dependent execution
- live Docker-backed execution of analytics pytest files remains pending because `docker compose exec` is still stalling after container handshake in this shell context

## Next Step
- run the full analytics contract suite in the stable API runtime
- then move from analytics implementation to analytics reports and test-plan artifacts if needed
