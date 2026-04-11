# Walkthrough - Service State Machine + Job Queue + Step-3 Enqueue + CORS hardening (CHG-032)

## Objective
Implement robust service/deployment state transitions, add backend job queue domain for deferred ingestion/embedding work, refactor create flow so step-3 enqueues jobs and finish executes/deploys, and address ingestion CORS issues.

## Implemented
1. Service/deployment state machine transitions (backend):
- Updated `capabilities/service/caps/create_service/api.py`.
- Added explicit transition maps:
  - `ServiceStatus`: `draft <-> active`, `draft -> archived`, `active -> archived`, `archived -> draft`.
  - `DeploymentStatus`: validated transition matrix.
- Added guardrails:
  - Archived service cannot move deployment to `deploying/live`.
  - Archiving a service automatically brings latest deployment down (`draft`).
- Added new endpoint:
  - `POST /api/service/v1/services/{service_id}/deployment/status`

2. Service list UI actions:
- Updated `ui-apps/service-gen-saas/app/dashboard/services/page.tsx`.
- Added direct `Modify` button per service item.
- Added service status actions on list cards:
  - Set Draft / Set Active / Archive
- Added deployment status actions on list cards:
  - Deployment Draft / Deployment Live / Deployment Failed
- Updated `ui-apps/service-gen-saas/components/service-status-actions.tsx` with deployment status controls too.
- Added route constant:
  - `SERVICE_DEPLOYMENT_STATUS` in `ui-apps/service-gen-saas/shared/routes.ts`.

3. New job domain with create_job cap:
- Added domain + cap files:
  - `capabilities/job/factory.py`
  - `capabilities/job/caps/create_job/api.py`
  - `capabilities/job/caps/create_job/handler.py`
  - `capabilities/job/caps/create_job/workflow.py`
  - `capabilities/job/caps/create_job/tasks.py`
  - `capabilities/job/caps/create_job/entities.py`
- Added package init files:
  - `capabilities/job/__init__.py`
  - `capabilities/job/caps/__init__.py`
  - `capabilities/job/caps/create_job/__init__.py`
- Mounted domain in API entrypoint:
  - `app/ingress/api/main.py` with prefix `/api/job`.
- Implemented endpoints:
  - `POST /api/job/services/{service_id}/jobs/ingest-file`
  - `POST /api/job/services/{service_id}/jobs/ingest-url`
  - `POST /api/job/services/{service_id}/jobs/execute`

4. DB model + migration for jobs:
- Added model:
  - `capabilities/db/models/job.py` (`job.jobs` table model)
- Added migration:
  - `capabilities/db/migrations/versions/0003_create_jobs_table.py`
  - Creates `job` schema (if needed) and `job.jobs` table + index.
- Registered model imports:
  - `capabilities/db/models/__init__.py`

5. Create flow refactor (step-3 enqueue, finish execute):
- Updated `ui-apps/service-gen-saas/app/dashboard/services/new/page.tsx`.
- Step 1/2/3/4:
  - Uses lightweight step-save spinner (`isSavingStep`) instead of onboarding modal.
- Step 3:
  - No direct embedding execution.
  - Enqueues jobs via:
    - `ROUTES.JOB_INGEST_FILE(serviceId)`
    - `ROUTES.JOB_INGEST_URL(serviceId)`
  - Marks datasource as queued/success in UI state.
- Finish:
  - Shows final onboarding modal/progress.
  - Executes pending jobs first:
    - `ROUTES.JOB_EXECUTE(serviceId)`
  - Then deploys service bot:
    - `ROUTES.SERVICE_DEPLOY(serviceId)`
  - Redirects to playground only after completion.

6. CORS hardening:
- Updated `app/ingress/api/main.py`:
  - Expanded allowed origins.
  - Added `allow_origin_regex` for `*.servicegen.local`.
- This addresses the observed browser CORS block pattern for SaaS -> API requests.

## Verification
- Python syntax validated for modified backend files using:
  - `PYTHONPYCACHEPREFIX=/tmp/pycache python3 -m py_compile ...`

## Note on service list retrieval from DB
- Current backend source for populating UI service list:
  - `capabilities/service/caps/create_service/api.py` -> `list_services()`
  - Query:
    - `db.query(Service).filter(Service.tenant_id == DEFAULT_TENANT_ID).order_by(Service.created_at.desc()).all()`
  - Serialized response is consumed by SaaS UI:
    - `ui-apps/service-gen-saas/app/dashboard/services/page.tsx` via `ROUTES.SERVICE_LIST`.

## Tracking
- Prompt copy saved:
  - `af-iclme/execution-plans/already_run/36_exe_plan_template_prompt.md`
- Walkthrough saved:
  - `af-iclme/layers/ideas/IDEA-SERV-CREATION-FINALIZE/changes/CHG-032/walkthrough.md`
