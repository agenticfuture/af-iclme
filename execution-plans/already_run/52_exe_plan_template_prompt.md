## Prompt for the AI agent:
(Execution plan template run #52)

Primary outcomes in this run:
- Fixed StatefulSet readiness deadlock conditions when running with `postgresInitJob.hookEnabled=true` and `--wait`.
- Hardened db-init job connectivity path and startup wait behavior.
- Removed init-path overlap by default when db-init job is enabled.
- Revalidated Postgres chart render/lint for local/staging.ovh/prod.ovh.

Tracking note:
- Full implementation and verification details are recorded in CHG-048 walkthrough.
