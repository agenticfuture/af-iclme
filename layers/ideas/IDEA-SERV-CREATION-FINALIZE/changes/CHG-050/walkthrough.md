# CHG-050 Walkthrough

## Scope
Fix persistent local Postgres `CrashLoopBackOff` with error:
- `chmod: changing permissions of '/var/lib/postgresql/data': Operation not permitted`
- `initdb: error: could not change permissions of directory "/var/lib/postgresql/data": Operation not permitted`

## Root cause addressed
Local storage backend + strict container security profile can block chmod/chown operations needed by Postgres initdb.

Chart defaults were enterprise-safe, but local cluster needed a compatibility override.

## Corrections implemented

### 1) Local-only compatibility security context
- File: `helm/servicegen/charts/postgres/values.local.yaml`
- Added:
  - `podSecurityContext.fsGroup: 0`
  - `containerSecurityContext.runAsUser: 0`
  - `containerSecurityContext.runAsGroup: 0`
  - `containerSecurityContext.runAsNonRoot: false`
  - `containerSecurityContext.capabilities.drop: []`
  - `volumePermissions.enabled: false`

This forces local Postgres startup path to avoid non-root chmod/chown failures.

### 2) Umbrella local overlay aligned
- File: `helm/servicegen/values.local.yaml`
- Mirrored same local compatibility overrides under `postgres.*`.

### 3) Documentation update
- File: `helm/servicegen/charts/postgres/README.md`
- Added explicit local compatibility-mode notes and rationale.

## Verification
- `helm template` chart with local values + hook enabled: confirms local root security context is rendered.
- `helm lint` chart local/staging.ovh/prod.ovh: all pass.

Note:
- umbrella render still blocked by unrelated existing parse issue in:
  - `servicegen/charts/service-gen-saas/templates/secret.yaml`
- postgres chart itself is valid.

## Local recovery map
For existing broken release/pod:
```bash
# Check failing reason
kubectl -n servicegen logs postgres-postgres-0 --previous

# Reconcile with local compatibility profile
helm upgrade --install postgres ./helm/servicegen/charts/postgres \
  -n servicegen \
  --create-namespace \
  -f ./helm/servicegen/charts/postgres/values.yaml \
  -f ./helm/servicegen/charts/postgres/values.local.yaml \
  --set postgresInitJob.hookEnabled=true \
  --wait --timeout 10m
```

If PVC data is still blocking startup and local data is disposable:
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
