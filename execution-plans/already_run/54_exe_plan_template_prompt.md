## Prompt for the AI agent:
(Execution plan template run #54)

Primary outcomes in this run:
- Corrected local CrashLoop behavior for Postgres chart by introducing local compatibility security context overrides.
- Kept enterprise hardening intact for staging/prod profiles while making local storage-driver edge cases operational.
- Revalidated chart render/lint integrity for local/staging/prod chart profiles.
- Provided recovery map for existing crashing local release.

Tracking note:
- Full implementation and verification details are recorded in CHG-050 walkthrough.
