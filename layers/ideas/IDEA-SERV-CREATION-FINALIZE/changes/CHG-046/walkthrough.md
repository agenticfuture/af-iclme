# CHG-046 Walkthrough

## Scope
Resolve Helm install timeout on Postgres release caused by `postgres-db-init` hook remaining InProgress until Helm context deadline.

User-reported error:
- `failed post-install: resource not ready, name: postgres-postgres-db-init, kind: Job, status: InProgress`
- `context deadline exceeded`

## Root cause
- Helm waits for hook Jobs to complete.
- `postgres-db-init` was configured as a post-install/post-upgrade hook in all profiles.
- In local flow, this can block install while DB startup readiness loop is still running.

## Corrections implemented

### 1) Added hook control + readiness timeout for db-init job
- File: `helm/servicegen/charts/postgres/values.yaml`
- Added:
  - `postgresInitJob.hookEnabled` (default `true`)
  - `postgresInitJob.waitForDbSeconds` (default `240`)

### 2) Updated db-init job template behavior
- File: `helm/servicegen/charts/postgres/templates/postgres-db-init.job.yaml`
- Hook annotations are now conditional on `postgresInitJob.hookEnabled`.
- Added bounded DB wait loop using `WAIT_FOR_DB_SECONDS` to avoid endless wait.
- If timeout reached, job fails with explicit message.

### 3) Local profile made non-blocking for install
- File: `helm/servicegen/charts/postgres/values.local.yaml`
- Set:
  - `postgresInitJob.hookEnabled: false`
  - `postgresInitJob.waitForDbSeconds: 180`

### 4) OVH staging/prod kept strict hook mode
- Files:
  - `helm/servicegen/charts/postgres/values.staging.ovh.yaml`
  - `helm/servicegen/charts/postgres/values.prod.ovh.yaml`
- Set:
  - `postgresInitJob.hookEnabled: true`
  - `postgresInitJob.waitForDbSeconds: 300`

### 5) Umbrella overlays aligned
- Files:
  - `helm/servicegen/values.local.yaml`
  - `helm/servicegen/values.staging.ovh.yaml`
  - `helm/servicegen/values.prod.ovh.yaml`
- Mirrored same hookEnabled/waitForDbSeconds profile behavior.

### 6) Documentation update
- File: `helm/servicegen/charts/postgres/README.md`
- Added note on why local disables hook and how to run hook mode with explicit timeout.

## Verification
- `helm template` local profile: db-init job present, no `helm.sh/hook` annotation.
- `helm template` staging.ovh profile: db-init job present with hook annotations.
- `helm lint` local/staging.ovh/prod.ovh: all pass.

## Local deployment map (recommended)
```bash
# namespace
kubectl create namespace servicegen --dry-run=client -o yaml | kubectl apply -f -

# install/upgrade (local profile)
helm upgrade --install postgres ./helm/servicegen/charts/postgres \
  -n servicegen \
  --create-namespace \
  -f ./helm/servicegen/charts/postgres/values.yaml \
  -f ./helm/servicegen/charts/postgres/values.local.yaml

# check runtime
kubectl -n servicegen get pods,svc,pvc,job
kubectl -n servicegen logs job/postgres-postgres-db-init
```

## If you intentionally enable hook mode locally
```bash
helm upgrade --install postgres ./helm/servicegen/charts/postgres \
  -n servicegen \
  --create-namespace \
  -f ./helm/servicegen/charts/postgres/values.yaml \
  -f ./helm/servicegen/charts/postgres/values.local.yaml \
  --set postgresInitJob.hookEnabled=true \
  --wait --timeout 10m
```
