# Architecture - Default Seeding

## Components

### 1. Seeding Script (`seed_default.py`)
- **Action**: Direct SQLAlchemy insert (or merge) to `core.tenants` and `core.organizations`.
- **Target IDs**: `00000000-0000-0000-0000-000000000001`.

### 2. Execution
- Run via `python capabilities/db/seeds/seed_default.py` inside the container or using a `Makefile` target.
