## Prompt for the AI agent:
(Execution plan template run #49)

Primary outcomes in this run:
- Audited and corrected the Postgres chart after replacing migration job with `postgres-db-init.job`.
- Fixed all value-to-template linkages for db-init (host/port/secrets/roles/databases).
- Added missing value schema for db-init and updated local/staging.ovh/prod.ovh profiles.
- Revalidated full Postgres chart integrity and rendering.

Tracking note:
- Full implementation and verification details are recorded in CHG-045 walkthrough.
