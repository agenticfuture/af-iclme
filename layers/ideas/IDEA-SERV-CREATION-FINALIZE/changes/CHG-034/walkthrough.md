# Walkthrough - Fix `relation "job.jobs" does not exist` by running idempotent migration (CHG-034)

## Objective
Resolve runtime SQL error:
- `sqlalchemy.exc.ProgrammingError: relation "job.jobs" does not exist`
while preserving SQLAlchemy model + migration approach and actually applying migration in the API container.

## Root Cause
`job.jobs` was being referenced before migration state was properly recorded/applied in DB.  
An initial migration run failed because `job.jobs` had already been created by runtime bootstrap, causing duplicate-table failure before revision stamping.

## Implemented Fix
1. Made migration `0003_create_jobs_table` idempotent:
- Updated:
  - `capabilities/db/migrations/versions/0003_create_jobs_table.py`
- Added table/index existence checks using SQLAlchemy inspector:
  - Create `job.jobs` only when absent.
  - Create `ix_job_jobs_service_status` only when absent.

2. Ran migration in API container:
- Command:
  - `docker compose -f docker-compose.generated.yml exec service-gen-api /app/.venv/bin/alembic -c capabilities/db/alembic.ini upgrade head`
- Result: success.

3. Verified migration revision:
- Command:
  - `docker compose -f docker-compose.generated.yml exec service-gen-api /app/.venv/bin/alembic -c capabilities/db/alembic.ini current`
- Output:
  - `0003_create_jobs_table (head)`

## Outcome
- DB now has recorded migration head including job table migration.
- `job.jobs` insert path is unblocked for enqueue operations.

## Tracking
- Prompt copy saved:
  - `af-iclme/execution-plans/already_run/38_exe_plan_template_prompt.md`
- Walkthrough saved:
  - `af-iclme/layers/ideas/IDEA-SERV-CREATION-FINALIZE/changes/CHG-034/walkthrough.md`
