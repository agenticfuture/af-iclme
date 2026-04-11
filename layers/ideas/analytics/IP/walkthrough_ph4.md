# Walkthrough PH4 - Analytics Source Health Slice

## Scope
Implemented the source and ingestion health slice for the analytics domain:
- backend top-sources capability
- tenant/org/service-scoped source analytics endpoint
- SaaS source health cards, outcome breakdowns, inventory, and recent failure panels
- backend contract test for source analytics

## Files Added
- `capabilities/analytics/caps/get_top_sources/entities.py`
- `capabilities/analytics/caps/get_top_sources/functions.py`
- `capabilities/analytics/caps/get_top_sources/workflow.py`
- `capabilities/analytics/caps/get_top_sources/handler.py`
- `capabilities/analytics/caps/get_top_sources/api.py`
- `app/ingress/api/tests/test_analytics_sources_contract.py`

## Files Updated
- `capabilities/analytics/shared/entities.py`
- `capabilities/analytics/adapters/core_db_reader.py`
- `capabilities/analytics/factory.py`
- `ui-apps/service-gen-saas/shared/routes.ts`
- `ui-apps/service-gen-saas/components/dashboard/analytics-dashboard.tsx`

## New Endpoint
`GET /api/analytics/v1/sources`

### Query inputs
- `tenant_id` required via authenticated scope or query/header fallback
- `org_id` optional
- `service_id` optional
- `limit` optional, default `10`, bounded `1..50`

### Response
- `scope`
- `summary`
  - `total_sources`
  - `services_with_sources`
  - `queued_ingestion_jobs`
  - `failed_ingestion_jobs`
- `source_types[]`
- `ingestion_statuses[]`
- `items[]`
- `recent_failures[]`
- `sources`

## Behavior
- Source inventory is read from `service.config.data_sources`.
- Ingestion health is read from `job.jobs` filtered to ingestion job types.
- Source/job linkage is resolved through `job.payload.metadata.source_id` and `source_type`.
- Recent failures are derived from failed ingestion jobs only.
- All analytics remain tenant-scoped and optionally narrowed to org/service.

## Frontend
Added to the analytics dashboard:
- Source Health Summary cards
- Recent ingestion failures panel
- Source Type Mix breakdown
- Ingestion Outcome Mix breakdown
- Source Inventory table

## Verification Performed
### Successful
- backend syntax compilation passed using `PYTHONPYCACHEPREFIX=/tmp/python-pyc-cache`
- frontend smoke check confirmed:
  - `ROUTES.ANALYTICS_SOURCES`
  - `Source Health Summary`
  - `Recent ingestion failures`
  - `Source Inventory`
  are present in the analytics dashboard component

### Pending environment-dependent execution
- live Docker-backed execution of analytics pytest files remains pending because `docker compose exec` is still stalling after container handshake in this shell context

## Next Step
- run the four analytics contract tests in a stable API runtime
- then implement analytics export for tenant-scoped JSON/CSV output
