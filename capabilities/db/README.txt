
ICLME Database Package
=======================

This package contains:

- Alembic migration for full ICLME schema
- Event store integration
- Artifact structured storage
- Project-scoped architecture
- Multi-domain & multi-type support
- Seed script for domains and idea types

How to Use
----------

1. Configure Alembic to point to your PostgreSQL database.
2. Place migration in alembic/versions/
3. Run:

   alembic upgrade head

4. Run seed script:

   python scripts/seed_icmle.py

Database must be PostgreSQL.
