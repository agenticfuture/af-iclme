# CHG-052 Walkthrough

## Scope
Resolve Helm local upgrade failure:
- `post-upgrade hooks failed: ... postgres-postgres-db-init ... NotFound/context deadline exceeded`
- Failed `db-init` hook pods after enabling `postgresInitJob.hookEnabled=true`

## Root cause
The hook job SQL used `\\gexec` inside a `psql -c` command. In this execution mode, escaping caused invalid SQL parsing (`syntax error at or near "\\"`), so the hook pods failed repeatedly and the release got stuck.

## Corrections implemented

### 1) Fixed idempotent DB creation SQL in hook job
- File: `helm/servicegen/charts/postgres/templates/postgres-db-init.job.yaml`
- Replaced `SELECT format(... ) ... \\gexec` with robust shell+SQL idempotent flow:
  - Check existence: `SELECT 1 FROM pg_database ...`
  - Create only when missing: `CREATE DATABASE ...`
  - Always enforce owner: `ALTER DATABASE ... OWNER TO ...`

### 2) Cleared release lock and re-ran deployment
- Release was `pending-upgrade`.
- Executed rollback to clear in-progress lock.
- Re-ran `helm upgrade --install ... --wait --timeout 10m`.

## Verification (live cluster)
Successful end state:
- `helm status postgres -n servicegen` => `STATUS: deployed`, `REVISION: 4`
- `kubectl get pods -n servicegen` => `postgres-postgres-0` is `1/1 Running`
- `kubectl get jobs -n servicegen` => `postgres-postgres-db-init` is `Complete`

## Local deployment map (clear + deploy)

### A) If release is stuck (pending-upgrade)
```bash
helm history postgres -n servicegen
helm rollback postgres 1 -n servicegen --wait --timeout 5m
```

### B) Install/upgrade postgres chart
```bash
helm upgrade --install postgres ./helm/servicegen/charts/postgres \
  -n servicegen \
  --create-namespace \
  -f ./helm/servicegen/charts/postgres/values.yaml \
  -f ./helm/servicegen/charts/postgres/values.local.yaml \
  --set postgresInitJob.hookEnabled=true \
  --wait --timeout 10m
```

### C) Validate health
```bash
helm status postgres -n servicegen
kubectl get pods -n servicegen | grep postgres-postgres
kubectl get jobs -n servicegen | grep postgres-postgres-db-init
kubectl logs -n servicegen job/postgres-postgres-db-init
```

## Result
Postgres chart now upgrades cleanly with hook-enabled db initialization in local environment, and no longer times out due to invalid hook SQL execution.
