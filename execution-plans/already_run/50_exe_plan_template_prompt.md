## Prompt for the AI agent:
(Execution plan template run #50)

Primary outcomes in this run:
- Fixed `postgres-db-init` Helm timeout behavior by adding hook control and deterministic DB wait timeout.
- Corrected db-init value wiring and profile defaults so local install no longer blocks on post-install hook.
- Revalidated chart integrity for local/staging.ovh/prod.ovh.
- Added clear local deployment and troubleshooting map.

Tracking note:
- Full implementation and verification details are recorded in CHG-046 walkthrough.
