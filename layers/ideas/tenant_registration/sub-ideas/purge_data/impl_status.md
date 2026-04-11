how is the purge triggered? automatically or? 

Right now: not automatic by default.

Current trigger behavior

Purge is implemented in the tenant domain (purge_unverified) and exposed via:
internal API endpoint: /api/tenant/v1/internal/purge-unverified
domain facade method: tenant_domain_api.purge_expired_pending_registrations(...)
It runs only when something calls it (manual/API/job).
What it does

Finds pending registrations past TTL (48h)
Marks registration as expired (EmailVerificationTimeout)
Deletes draft projections (core.tenants, core.organizations, core.users, private.user_pii)
What is missing for “automatic”

A scheduler/job trigger (cron/worker/Prefect scheduled run/K8s CronJob)
Ops wiring in compose/helm for periodic execution
So:

Implemented purge logic: yes
Automatic scheduled execution: not yet (needs job scheduling wiring)
If you want, next I can add the automatic trigger properly (compose dev + k8s CronJob path) and include tests/report updates.