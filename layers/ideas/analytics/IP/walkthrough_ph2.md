# Walkthrough PH2 - Analytics Timeseries Slice

## Scope
Implemented Phase 2 of the analytics idea:
- backend timeseries capability
- tenant/org/service-scoped timeseries route
- SaaS dashboard trend visuals for conversations, messages, jobs, and deployments
- first timeseries contract test

## Files Added
- `capabilities/analytics/adapters/timeseries.py`
- `capabilities/analytics/caps/get_timeseries/entities.py`
- `capabilities/analytics/caps/get_timeseries/functions.py`
- `capabilities/analytics/caps/get_timeseries/workflow.py`
- `capabilities/analytics/caps/get_timeseries/handler.py`
- `capabilities/analytics/caps/get_timeseries/api.py`
- `app/ingress/api/tests/test_analytics_timeseries_contract.py`

## Files Updated
- `capabilities/analytics/shared/entities.py`
- `capabilities/analytics/adapters/core_db_reader.py`
- `capabilities/analytics/adapters/chatbot_db_reader.py`
- `capabilities/analytics/factory.py`
- `ui-apps/service-gen-saas/shared/routes.ts`
- `ui-apps/service-gen-saas/components/dashboard/analytics-dashboard.tsx`

## New Endpoint
`GET /api/analytics/v1/timeseries`

### Query inputs
- `tenant_id` required via authenticated scope or query/header fallback
- `org_id` optional
- `service_id` optional
- `days` optional, default `14`, bounded `7..90`

### Response
- `scope`
- `days`
- `series`:
  - `conversations`
  - `messages`
  - `jobs`
  - `deployments`
- `sources`:
  - `core`
  - `chatbot`

## Behavior
- Uses day buckets over a recent rolling window.
- Core DB provides jobs and deployments always.
- Conversations/messages come from chatbot DB when configured; otherwise they fall back to core conversation tables.
- Empty days are normalized to zero-count points so the frontend can render a stable chart shape.

## Frontend
The analytics dashboard now loads both:
- overview metrics
- timeseries metrics

New trend cards:
- Conversation Trend
- Message Trend
- Job Trend
- Deployment Trend

The visuals intentionally use lightweight in-page bars instead of an added chart dependency.

## Verification Performed
### Successful
- backend syntax compilation passed using `PYTHONPYCACHEPREFIX=/tmp/python-pyc-cache`
- frontend smoke check confirmed:
  - `ROUTES.ANALYTICS_TIMESERIES`
  - `TrendChart`
  - `Conversation Trend`
  are all present in the dashboard component

### Pending environment-dependent execution
- live Docker-backed execution of the analytics pytest files remains pending because `docker compose exec` is stalling after container handshake in this shell context

## Next Step
- execute the overview and timeseries analytics pytest files inside the stable API runtime when container exec is responsive again
- then move to per-service analytics and source-health analytics
