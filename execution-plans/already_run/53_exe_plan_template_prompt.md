## Prompt for the AI agent:
(Execution plan template run #53)

Primary outcomes in this run:
- Corrected Postgres StatefulSet CrashLoop risk by adding PVC permission normalization initContainer.
- Preserved hook-enabled db-init workflow while hardening pod startup path.
- Added explicit local recovery instructions for existing broken PVC/data states.
- Revalidated chart render/lint integrity.

Tracking note:
- Full implementation and verification details are recorded in CHG-049 walkthrough.
