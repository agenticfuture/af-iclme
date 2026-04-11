# CHG-044 Walkthrough

## Scope
Follow-up refinement of Postgres Helm profiles under ServiceGen umbrella:
- rename `staging` profile to explicit `staging.ovh`
- add explicit `prod.ovh`
- keep local working
- keep env/secret key model stable across environments

## Changes implemented

### 1) Renamed profile files (chart level)
- `helm/servicegen/charts/postgres/values.staging.yaml` -> `helm/servicegen/charts/postgres/values.staging.ovh.yaml`
- `helm/servicegen/charts/postgres/values.ovh.yaml` -> `helm/servicegen/charts/postgres/values.prod.ovh.yaml`

### 2) Renamed profile files (umbrella level)
- `helm/servicegen/values.staging.yaml` -> `helm/servicegen/values.staging.ovh.yaml`
- `helm/servicegen/values.ovh.yaml` -> `helm/servicegen/values.prod.ovh.yaml`

### 3) OVH staging/prod values tuned
- `values.staging.ovh.yaml`:
  - lower-cost startup resources (200m/512Mi requests, 700m/1Gi limits)
  - 30Gi PVC
  - NetworkPolicy enabled
  - migration hook enabled
- `values.prod.ovh.yaml`:
  - production-safe resources (500m/1Gi requests, 2CPU/4Gi limits)
  - 120Gi PVC
  - NetworkPolicy enabled
  - migration hook enabled

### 4) Env compatibility normalization
Across local/staging.ovh/prod.ovh, secret key contract remains identical:
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`

This minimizes `.env` changes between environments.

### 5) Deployment map/documentation update
Updated:
- `helm/servicegen/charts/postgres/README.md`

Now references:
- `values.staging.ovh.yaml`
- `values.prod.ovh.yaml`
- `helm/servicegen/values.staging.ovh.yaml`
- `helm/servicegen/values.prod.ovh.yaml`

## Verification
Executed successfully:
- `helm template` local profile: OK
- `helm template` staging.ovh profile: OK
- `helm template` prod.ovh profile: OK
- `helm lint` for local/staging.ovh/prod.ovh: OK

## Local deploy command (working)
```bash
helm upgrade --install servicegen-postgres \
  helm/servicegen/charts/postgres \
  -n servicegen --create-namespace \
  -f helm/servicegen/charts/postgres/values.yaml \
  -f helm/servicegen/charts/postgres/values.local.yaml
```
