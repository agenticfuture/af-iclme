# CHG-051 Walkthrough

## Scope
Resolve Helm upgrade failure:
- `post-upgrade hooks failed: resource not ready, name: postgres-postgres-db-init, kind: Job, status: NotFound`
- `context deadline exceeded`

## Root cause
Hook lifecycle policy was deleting successful hook jobs too aggressively for wait-mode checks.
When `helm --wait` attempted to observe hook completion status, resource lookup could hit `NotFound`.

## Corrections implemented

### 1) Hook delete policy hardened
- File: `helm/servicegen/charts/postgres/values.yaml`
- Default changed:
  - `postgresInitJob.hookDeletePolicy` from `before-hook-creation,hook-succeeded`
  - to `before-hook-creation`

This keeps the hook job available for Helm status observation during wait.

### 2) Profile-level alignment
Updated to same policy:
- `helm/servicegen/charts/postgres/values.local.yaml`
- `helm/servicegen/charts/postgres/values.staging.ovh.yaml`
- `helm/servicegen/charts/postgres/values.prod.ovh.yaml`
- `helm/servicegen/values.local.yaml`
- `helm/servicegen/values.staging.ovh.yaml`
- `helm/servicegen/values.prod.ovh.yaml`

### 3) Documentation update
- File: `helm/servicegen/charts/postgres/README.md`
- Added note about hook lifecycle safety and why policy is `before-hook-creation`.

## Verification
Passed:
- `helm template` local (hook enabled) includes:
  - `helm.sh/hook: post-install,post-upgrade`
  - `helm.sh/hook-delete-policy: before-hook-creation`
- `helm template` staging profile confirms same policy.
- `helm lint` local/staging.ovh/prod.ovh: all pass.

## Local deploy map (hook-enabled)
```bash
helm upgrade --install postgres ./helm/servicegen/charts/postgres \
  -n servicegen \
  -f ./helm/servicegen/charts/postgres/values.yaml \
  -f ./helm/servicegen/charts/postgres/values.local.yaml \
  --set postgresInitJob.hookEnabled=true \
  --wait --timeout 10m
```

If needed for deterministic logs during retries:
```bash
kubectl -n servicegen get jobs
kubectl -n servicegen logs job/postgres-postgres-db-init
kubectl -n servicegen describe job/postgres-postgres-db-init
```
