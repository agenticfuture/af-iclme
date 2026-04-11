# CHG-036 Walkthrough

## Scope
This run finalizes the requested posture by preserving all recent service/job/state-machine/UI improvements and explicitly reverting **service-gen-ai-chatbot** DB runtime back to **NeonDB**.

## Implemented in this run

1. Reverted chatbot DB env to NeonDB (runtime source of truth)
- Updated:
  - `ui-apps/service-gen-ai-chatbot/.env`
- Restored Neon values for:
  - `DATABASE_URL`
  - `DATABASE_URL_UNPOOLED`
  - `POSTGRES_URL`
  - `POSTGRES_URL_NON_POOLING`
  - `POSTGRES_URL_NO_SSL`
  - related `PG*` and `POSTGRES_*` fields

2. Recreated chatbot container to pick up reverted env
- Command executed (compose file: `docker-compose.generated.yml`):
  - `docker compose ... up -d --force-recreate service-gen-ai-chatbot`

3. Verified chatbot container runtime env now points to NeonDB
- Command:
  - `docker compose ... exec service-gen-ai-chatbot sh -lc 'echo $POSTGRES_URL && echo $DATABASE_URL'`
- Result:
  - Both env vars resolved to Neon connection string (`ep-icy-truth-ad32wz5z...neondb?sslmode=require`).

4. Executed chatbot DB migrations after Neon revert
- Command:
  - `docker compose ... exec service-gen-ai-chatbot sh -lc 'pnpm db:migrate'`
- Result:
  - Migration completed successfully.

5. Re-validated API migration head
- Command:
  - `docker compose ... exec service-gen-api /app/.venv/bin/alembic -c capabilities/db/alembic.ini current`
- Result:
  - `0003_create_jobs_table (head)`

6. Env contract update for users role completeness
- Added missing example var:
  - `ui-apps/service-gen-saas/.env.example`
  - `AUTH0_HUMAN_AGENT_ROLE_ID=`

## Existing delivered items kept (from prior changes)
- Service + deployment state machine transitions with archived-service deployment guard.
- Service list actions for status/deployment status changes.
- Modify navigation path in service list.
- Job domain (`create_job` cap), SQLAlchemy model, migration, and execute endpoint.
- Create-service finish flow executing queued jobs and exposing real execute/failed counts in UI state text.
- Duplicate-name checks (service/bot) with user-facing 409 feedback.
- SaaS analytics “Coming Soon”, settings/account/users navigation completion.
- Users page shifted from mock to backend-backed organization members/invitations.
- `human Agent` role wired through invite/update/labels/validation.

## “How service list is populated from DB” (requested output)
- Backend query path:
  - `capabilities/service/caps/create_service/api.py`
  - `list_services()` does:
    - `db.query(Service).filter(Service.tenant_id == DEFAULT_TENANT_ID).order_by(Service.created_at.desc()).all()`
    - then serializes via `_serialize_service(...)` to include chatbot/deployment/channel/config fields.
- Frontend consumption path:
  - `ui-apps/service-gen-saas/app/dashboard/services/page.tsx`
  - fetches `ROUTES.SERVICE_LIST` and renders cards/table with status controls.

## Verification summary
- Chatbot runtime now uses NeonDB (confirmed inside container env).
- Chatbot migration command succeeds on NeonDB.
- API migrations remain at head with jobs table migration applied.

