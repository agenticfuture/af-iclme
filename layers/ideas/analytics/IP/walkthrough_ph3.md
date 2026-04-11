# Walkthrough PH3 - Analytics Service Performance Slice

## Scope
Implemented the next analytics slice focused on service-level performance:
- backend per-service analytics capability
- tenant/org-scoped service analytics endpoint
- SaaS service performance table in the analytics dashboard
- backend contract test for service analytics rows

## Files Added
- `capabilities/analytics/caps/get_service_analytics/entities.py`
- `capabilities/analytics/caps/get_service_analytics/functions.py`
- `capabilities/analytics/caps/get_service_analytics/workflow.py`
- `capabilities/analytics/caps/get_service_analytics/handler.py`
- `capabilities/analytics/caps/get_service_analytics/api.py`
- `app/ingress/api/tests/test_analytics_services_contract.py`

## Files Updated
- `capabilities/analytics/shared/entities.py`
- `capabilities/analytics/adapters/core_db_reader.py`
- `capabilities/analytics/adapters/chatbot_db_reader.py`
- `capabilities/analytics/factory.py`
- `ui-apps/service-gen-saas/shared/routes.ts`
- `ui-apps/service-gen-saas/components/dashboard/analytics-dashboard.tsx`

## New Endpoint
`GET /api/analytics/v1/services`

### Query inputs
- `tenant_id` required via authenticated scope or query/header fallback
- `org_id` optional
- `limit` optional, default `20`, bounded `1..100`

### Response
- `scope`
- `items[]` with:
  - `service_id`
  - `name`
  - `service_status`
  - `deployment_status`
  - `conversations`
  - `messages`
  - `failed_jobs`
  - `last_activity_at`
- `sources`

## Behavior
- Service base list comes from the core ServiceGen DB.
- Latest deployment status and failed job counts come from the core DB.
- Conversation and message counts are overridden with chatbot DB values when chatbot analytics is available.
- Last activity prefers the freshest available timestamp from the available sources.

## Frontend
Added a Service Performance table to the analytics dashboard showing:
- service name
- service status
- deployment status
- conversations
- messages
- failed jobs
- last activity

## Verification Performed
### Successful
- backend syntax compilation passed using `PYTHONPYCACHEPREFIX=/tmp/python-pyc-cache`
- frontend smoke check confirmed:
  - `ROUTES.ANALYTICS_SERVICES`
  - `Service Performance`
  - `TableHeader`
  are present in the analytics dashboard component

### Pending environment-dependent execution
- live Docker-backed execution of analytics pytest files remains pending because `docker compose exec` is still stalling after container handshake in this shell context

## Next Step
- run the analytics overview, timeseries, and services contract tests in the stable API runtime once container exec is responsive again
- then continue with source-health analytics or export
