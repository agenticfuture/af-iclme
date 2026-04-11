# CHG-049 Walkthrough

## Scope
Fix `CrashLoopBackOff` on `postgres-postgres-0` with StatefulSet deployment while keeping enterprise-grade chart behavior and hook-enabled db-init path.

Observed user state:
- StatefulSet exists and pod running/restarting heavily.
- Pod readiness stays `0/1`, eventually `CrashLoopBackOff`.

## Root cause pattern addressed
Common local-cluster/Postgres issue on PVC mounts:
- data directory ownership/permission mismatch on mounted volume
- postgres process (`runAsUser: 999`) cannot initialize/access PGDATA reliably

## Corrections implemented

### 1) Added volume permission initContainer
- File: `helm/servicegen/charts/postgres/values.yaml`
  - new `volumePermissions` block (enabled by default)
- File: `helm/servicegen/charts/postgres/templates/statefulset.yaml`
  - added `initContainers.volume-permissions`
  - runs as root and ensures:
    - `mkdir -p {{ persistence.pgDataSubPath }}`
    - `chown -R runAsUser:runAsGroup {{ persistence.mountPath }}`
    - `chmod 700 {{ persistence.pgDataSubPath }}`

### 2) Kept startup hardening already in place
- `PGDATA` remains set to subdirectory (`/var/lib/postgresql/data/pgdata`) to avoid PVC root/lost+found init issues.

### 3) Updated deployment/recovery docs
- File: `helm/servicegen/charts/postgres/README.md`
- Added:
  - CrashLoop diagnosis command (`--previous` logs)
  - safe reconcile command
  - local reset path (delete StatefulSet + PVC) for irrecoverable dev data state

## Verification
Executed and passed:
- `helm template` local profile: includes `initContainers.volume-permissions` and `PGDATA`.
- `helm template` local profile with `postgresInitJob.hookEnabled=true`: includes StatefulSet + hook job.
- `helm lint` local/staging.ovh/prod.ovh: all pass.

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

If still failing:
```bash
kubectl -n servicegen logs postgres-postgres-0 --previous
kubectl -n servicegen describe pod postgres-postgres-0
```

If local data is corrupted/incompatible and disposable:
```bash
kubectl -n servicegen delete statefulset postgres-postgres
kubectl -n servicegen delete pvc data-postgres-postgres-0
helm upgrade --install postgres ./helm/servicegen/charts/postgres \
  -n servicegen \
  -f ./helm/servicegen/charts/postgres/values.yaml \
  -f ./helm/servicegen/charts/postgres/values.local.yaml \
  --set postgresInitJob.hookEnabled=true \
  --wait --timeout 10m
```
