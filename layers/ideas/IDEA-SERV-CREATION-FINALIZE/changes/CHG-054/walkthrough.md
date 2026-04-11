# CHG-054 Walkthrough

## Scope
Implement enterprise-grade Helm deployment support for `keycloak` and `prefect` under `helm/servicegen`, aligned with docker compose/env conventions and verified live in Kubernetes.

## Changes implemented

### 1) New Keycloak chart created
Path: `helm/servicegen/charts/keycloak`

Added:
- `Chart.yaml`
- `values.yaml`, `values.local.yaml`, `values.staging.ovh.yaml`, `values.prod.ovh.yaml`
- Templates:
  - `_helpers.tpl`
  - `serviceaccount.yaml`
  - `configmap.yaml`
  - `secret.yaml`
  - `deployment.yaml`
  - `service.yaml`
  - `networkpolicy.yaml`
  - `pdb.yaml`
  - `ingress.yaml`
  - `hpa.yaml`

Keycloak env/secret mapping follows compose conventions:
- `KC_DB`, `KC_DB_URL`, `KC_DB_USERNAME`, `KC_DB_PASSWORD`
- `KEYCLOAK_ADMIN`, `KEYCLOAK_ADMIN_PASSWORD`

### 2) Prefect chart rebuilt
Path: `helm/servicegen/charts/prefect`

Replaced scaffold templates with enterprise-grade templates:
- `_helpers.tpl`
- `serviceaccount.yaml`
- `configmap.yaml`
- `secret.yaml`
- `pvc.yaml`
- `deployment.yaml`
- `service.yaml`
- `networkpolicy.yaml`
- `pdb.yaml`
- `ingress.yaml`
- `hpa.yaml`

Also added environment profiles:
- `values.local.yaml`
- `values.staging.ovh.yaml`
- `values.prod.ovh.yaml`

### 3) Umbrella wiring updated
- Updated `helm/servicegen/Chart.yaml` dependency list to include `keycloak`.
- Updated `helm/servicegen/Chart.yaml` to use `prefect` chart version `0.2.0`.
- Added `prefect` and `keycloak` blocks in:
  - `helm/servicegen/values.local.yaml`
  - `helm/servicegen/values.staging.ovh.yaml`
  - `helm/servicegen/values.prod.ovh.yaml`

## Fix applied during live deployment
Prefect initially crashed with permissions (`PermissionError` writing Prefect UI path).
Resolved by setting compatible runtime security context in `prefect/values.yaml`:
- `runAsUser: 0`
- `runAsGroup: 0`
- `runAsNonRoot: false`
- `fsGroup: 0`

## Validation and deployment commands

Lint checks:
```bash
helm lint ./helm/servicegen/charts/prefect -f ./helm/servicegen/charts/prefect/values.yaml -f ./helm/servicegen/charts/prefect/values.local.yaml
helm lint ./helm/servicegen/charts/keycloak -f ./helm/servicegen/charts/keycloak/values.yaml -f ./helm/servicegen/charts/keycloak/values.local.yaml
helm lint ./helm/servicegen -f ./helm/servicegen/values.local.yaml
```

Dependency refresh:
```bash
helm dependency build ./helm/servicegen
```

Deployment commands executed:
```bash
helm upgrade --install keycloak ./helm/servicegen/charts/keycloak \
  -n servicegen --create-namespace \
  -f ./helm/servicegen/charts/keycloak/values.yaml \
  -f ./helm/servicegen/charts/keycloak/values.local.yaml \
  --wait --timeout 12m

helm upgrade --install prefect ./helm/servicegen/charts/prefect \
  -n servicegen --create-namespace \
  -f ./helm/servicegen/charts/prefect/values.yaml \
  -f ./helm/servicegen/charts/prefect/values.local.yaml \
  --wait --timeout 10m
```

## Runtime verification (live cluster)
- `helm status keycloak -n servicegen` => `STATUS: deployed`
- `helm status prefect -n servicegen` => `STATUS: deployed`
- Pods:
  - `keycloak-...` => `1/1 Running`
  - `prefect-...` => `1/1 Running`
  - `postgres-postgres-0` => `1/1 Running`
- Services and endpoints present:
  - `keycloak:8080`
  - `prefect:4200`
  - `postgres-postgres:5432`

## Local deployment map

```bash
helm dependency build ./helm/servicegen

helm upgrade --install postgres ./helm/servicegen/charts/postgres \
  -n servicegen --create-namespace \
  -f ./helm/servicegen/charts/postgres/values.yaml \
  -f ./helm/servicegen/charts/postgres/values.local.yaml \
  --set postgresInitJob.hookEnabled=true \
  --wait --timeout 10m

helm upgrade --install keycloak ./helm/servicegen/charts/keycloak \
  -n servicegen \
  -f ./helm/servicegen/charts/keycloak/values.yaml \
  -f ./helm/servicegen/charts/keycloak/values.local.yaml \
  --wait --timeout 12m

helm upgrade --install prefect ./helm/servicegen/charts/prefect \
  -n servicegen \
  -f ./helm/servicegen/charts/prefect/values.yaml \
  -f ./helm/servicegen/charts/prefect/values.local.yaml \
  --wait --timeout 10m

kubectl get pods -n servicegen | egrep 'postgres|keycloak|prefect'
kubectl get svc -n servicegen | egrep 'postgres|keycloak|prefect'
kubectl get endpoints -n servicegen keycloak prefect postgres-postgres -o wide
```
