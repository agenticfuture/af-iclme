# Analytics Domain Implementation Plan v1.0.0

## Objective
Build a tenant/org/service-scoped analytics domain that reads real platform data from the core ServiceGen database and the chatbot database, exposes a unified backend analytics API, and powers the SaaS analytics dashboard with live visuals and drill-down actions.

## Architectural Direction
- Implement analytics as a read-oriented backend domain under `capabilities/analytics`.
- Read from two persistence surfaces through adapters:
  - core platform DB: services, deployments, jobs, conversation tables
  - chatbot DB: `Chat`, `Message_v2`
- Do not route analytics through the SaaS frontend or chatbot UI API.
- Keep all reads tenant-scoped by default, optionally narrowed by org and service.
- Start with live read models over current tables. Add materialized analytics tables only if query cost later justifies it.

## Domain Structure
- `capabilities/analytics/__init__.py`
- `capabilities/analytics/factory.py`
- `capabilities/analytics/shared/`
  - `entities.py`
  - `contracts.py`
  - `errors.py`
- `capabilities/analytics/adapters/`
  - `core_db_reader.py`
  - `chatbot_db_reader.py`
  - `aggregation.py`
- `capabilities/analytics/caps/get_overview/`
  - `handler.py`
  - `workflow.py`
  - `functions.py`
  - `entities.py`
  - `api.py`
- future caps:
  - `get_timeseries`
  - `get_service_analytics`
  - `get_top_sources`
  - `export_report`

## Data Sources
### Core platform DB
- `service.services`
- `service.deployments`
- `job.jobs`
- `conversation.threads`
- `conversation.messages`

### Chatbot DB
- `Chat`
- `Message_v2`

## Scope Rules
- Every analytics request is tenant-scoped.
- If org is present, all queries also filter on org.
- If service filter is present, queries narrow to that service.
- No analytics route may return cross-tenant or cross-org aggregates.

## Phase 1: Overview Slice
### Backend
Implement `GET /api/analytics/v1/overview` returning:
- summary cards:
  - total services
  - active services
  - published deployments
  - failed deployments
  - total jobs
  - failed jobs
  - total conversations
  - total messages
- grouped status breakdowns:
  - services by status
  - deployments by status
  - jobs by status
- recent activity summary:
  - last deployment timestamp
  - last job timestamp
  - last conversation timestamp

### Frontend
Replace the placeholder analytics page with:
- summary KPI cards
- service/deployment/job status summary cards
- recent activity panel
- refresh action
- clear placeholders for upcoming charts

## Phase 2: Timeseries
Implement `GET /api/analytics/v1/timeseries` with date range filters and daily buckets for:
- conversations
- messages
- jobs
- deployments

## Phase 3: Service Analytics
Implement `GET /api/analytics/v1/services` with ranked per-service metrics:
- service name
- service status
- deployment status
- conversation count
- message count
- last activity
- failed jobs

## Phase 4: Source and Ingestion Analytics
Implement `GET /api/analytics/v1/sources`:
- top source types
- failed ingestion jobs
- processing success/failure mix
- recent source-processing activity

## Phase 5: Export
Implement `GET /api/analytics/v1/export`:
- filtered JSON/CSV export
- tenant/org/service scoped only

## SaaS Routing
Add a SaaS proxy route mirroring current backend proxy patterns:
- `/app/api/analytics/[...path]/route.ts`
Add route constants to `shared/routes.ts`.

## Testing Strategy
Use the layered non-browser strategy.

### Layer 1: Domain logic
- aggregation helpers
- ratio/delta calculations
- response normalization

### Layer 2: Adapter integration
- core DB scoped reads
- chatbot DB scoped reads
- empty-state handling

### Layer 3: API contracts
- overview response shape
- filter validation
- auth-required behavior

### Layer 4: Security
- tenant/org/service isolation
- reject scope mismatch
- prevent cross-tenant export/access

### Layer 5: UI contract/component
- analytics cards render from payload
- refresh path works
- status summaries render correctly

## First Execution Order
1. Save this plan.
2. Scaffold analytics domain.
3. Implement overview backend over core DB first.
4. Add chatbot DB adapter and merge chatbot counts if chatbot DB env is present.
5. Mount analytics routes in API.
6. Add SaaS analytics proxy route and route constants.
7. Replace analytics placeholder page with live overview UI.
8. Add first contract tests for overview.
9. Save walkthrough and current-state docs for the analytics idea.

## Notes
- Browser E2E is deferred until built runtime, same current project strategy.
- Analytics should stay read-only in early phases.
- The analytics factory will become the external door for cross-domain reads later.
