# CHG-048 Walkthrough

## Scope
Resolve Helm upgrade timeout with message:
- `resource not ready, name: postgres-postgres, kind: StatefulSet, status: Failed`
- `context deadline exceeded`

while using hook-enabled db-init flow.

## Root failure pattern addressed
Two startup risk patterns were present:
1) Hook job endpoint deadlock risk:
   db-init job attempted DB access via standard service endpoint path in a wait-gated install flow.
2) Initialization overlap:
   both db-init job and container initdb scripts could run in same release path.

## Corrections implemented

### 1) Headless endpoint for db-init connectivity
- File: `helm/servicegen/charts/postgres/templates/postgres-db-init.job.yaml`
- `POSTGRES_HOST` default now resolves to `<release>-postgres-headless`.
- This uses `publishNotReadyAddresses` behavior and avoids service endpoint readiness gating deadlocks.

### 2) Bounded wait timeout in db-init job
- File: `helm/servicegen/charts/postgres/templates/postgres-db-init.job.yaml`
- Added `WAIT_FOR_DB_SECONDS` env and explicit timeout fail path in `pg_isready` wait loop.
- Prevents indefinite hook wait behavior.

### 3) Hook behavior control retained
- File: `helm/servicegen/charts/postgres/values.yaml`
- Supports:
  - `postgresInitJob.hookEnabled`
  - `postgresInitJob.waitForDbSeconds`

### 4) Prevent init overlap by default
- File: `helm/servicegen/charts/postgres/values.yaml`
  - `initdb.disableWhenDbInitJobEnabled: true`
- File: `helm/servicegen/charts/postgres/templates/statefulset.yaml`
  - initdb mount now disabled when db-init job is enabled and overlap guard is true.

### 5) Job support improvements
- File: `helm/servicegen/charts/postgres/templates/postgres-db-init.job.yaml`
- Added `imagePullSecrets` support for private registries.

### 6) Documentation update
- File: `helm/servicegen/charts/postgres/README.md`
- Added deadlock prevention + overlap-control notes.

## Verification
Passed checks:
- `helm template` local profile (hook enabled/disabled)
- `helm template` staging.ovh/prod.ovh
- `helm lint` local/staging.ovh/prod.ovh

Rendered output confirmed:
- hook-enabled mode includes `helm.sh/hook` annotations
- db-init host defaults to headless service
- bounded wait timeout present
- initdb mount omitted in hook-enabled overlap-guarded path

## Local deployment map
```bash
kubectl create namespace servicegen --dry-run=client -o yaml | kubectl apply -f -

helm upgrade --install postgres ./helm/servicegen/charts/postgres \
  -n servicegen \
  --create-namespace \
  -f ./helm/servicegen/charts/postgres/values.yaml \
  -f ./helm/servicegen/charts/postgres/values.local.yaml \
  --set postgresInitJob.hookEnabled=true \
  --wait --timeout 10m
```

If timeout still occurs, run:
```bash
kubectl -n servicegen get pods,pvc,job,events --sort-by=.lastTimestamp
kubectl -n servicegen describe pod postgres-postgres-0
kubectl -n servicegen logs statefulset/postgres-postgres
kubectl -n servicegen logs job/postgres-postgres-db-init
```
