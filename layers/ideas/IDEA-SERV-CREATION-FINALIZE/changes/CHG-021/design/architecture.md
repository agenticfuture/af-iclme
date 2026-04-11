# CHG-021 Design Summary

## Execution Context
- Compose file: `docker-compose.generated.yml`
- Target runtime service: `service-gen-api`
- Required command path: `/app/.venv/bin/uv`

## Approach
1. Confirm service availability with `docker compose ps`.
2. Validate venv command path inside container using `/app/.venv/bin/uv --version`.
3. Run DB migration from `/app/capabilities/db` with `uv run alembic upgrade head`.
4. Confirm migration with `uv run alembic current` and direct DB schema check.
5. Reconfirm frontend wizard still contains service and bot creation sections.
