# CHG-047 Walkthrough

## Scope
Address Helm upgrade/install failure where StatefulSet remained not ready and timed out (`context deadline exceeded`) when using:

```bash
helm upgrade --install postgres ./helm/servicegen/charts/postgres \
  -n servicegen --create-namespace \
  -f ./helm/servicegen/charts/postgres/values.yaml \
  -f ./helm/servicegen/charts/postgres/values.local.yaml \
  --set postgresInitJob.hookEnabled=true \
  --wait --timeout 10m
```

## Root cause (most likely)
With PVC-backed Postgres, initialization can fail on the mounted root directory (common `lost+found` pattern), causing the postgres container to fail startup and the StatefulSet to never become ready.

## Corrections implemented

### 1) Added explicit PGDATA subdirectory
- File: `helm/servicegen/charts/postgres/values.yaml`
- Added:
  - `persistence.pgDataSubPath: /var/lib/postgresql/data/pgdata`

### 2) Wired PGDATA into StatefulSet container env
- File: `helm/servicegen/charts/postgres/templates/statefulset.yaml`
- Added env var:
  - `PGDATA={{ .Values.persistence.pgDataSubPath }}`

This prevents initdb from using PVC root directly and improves startup reliability.

### 3) Documentation update
- File: `helm/servicegen/charts/postgres/README.md`
- Added explicit note about PGDATA/lost+found startup issue prevention.

## Verification
Executed and passed:
- `helm template` local profile
- `helm template` local profile with `--set postgresInitJob.hookEnabled=true`
- `helm lint` local/staging.ovh/prod.ovh

Template verification confirmed:
- StatefulSet includes `PGDATA` env var.
- Hook job still renders properly in hook-enabled mode.

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

If timeout persists, inspect quickly:
```bash
kubectl -n servicegen get pods,pvc,job
kubectl -n servicegen describe pod -l app.kubernetes.io/name=postgres
kubectl -n servicegen logs statefulset/postgres-postgres
kubectl -n servicegen logs job/postgres-postgres-db-init
```
