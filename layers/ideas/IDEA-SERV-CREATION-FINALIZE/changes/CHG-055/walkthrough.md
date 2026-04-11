# CHG-055 Walkthrough

## Scope
Implement and validate enterprise-grade Helm charts for `minio`, `ollama`, and `traefik` under `helm/servicegen`, aligned with docker compose/service env conventions.

## Changes implemented

### 1) MinIO chart rebuilt
Path: `helm/servicegen/charts/minio`

Added/updated:
- `Chart.yaml`
- `values.yaml`, `values.local.yaml`, `values.staging.ovh.yaml`, `values.prod.ovh.yaml`
- Templates:
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

Removed obsolete scaffold template:
- `templates/statefulset.yaml`

### 2) Ollama chart rebuilt
Path: `helm/servicegen/charts/ollama`

Added/updated:
- `Chart.yaml`
- `values.yaml`, `values.local.yaml`, `values.staging.ovh.yaml`, `values.prod.ovh.yaml`
- Templates:
  - `_helpers.tpl`
  - `serviceaccount.yaml`
  - `configmap.yaml`
  - `pvc.yaml`
  - `deployment.yaml`
  - `service.yaml`
  - `networkpolicy.yaml`
  - `pdb.yaml`
  - `ingress.yaml`
  - `hpa.yaml`

Removed invalid legacy template:
- `templates/secret.yaml`

### 3) New Traefik chart created
Path: `helm/servicegen/charts/traefik`

Created:
- `Chart.yaml`
- `values.yaml`, `values.local.yaml`, `values.staging.ovh.yaml`, `values.prod.ovh.yaml`
- Templates:
  - `_helpers.tpl`
  - `serviceaccount.yaml`
  - `rbac.yaml`
  - `configmap.yaml`
  - `deployment.yaml`
  - `service.yaml`
  - `networkpolicy.yaml`
  - `pdb.yaml`
  - `hpa.yaml`

### 4) Umbrella wiring updates
- Updated `helm/servicegen/Chart.yaml` to include `traefik` dependency.
- Added `minio`, `ollama`, and `traefik` blocks to:
  - `helm/servicegen/values.local.yaml`
  - `helm/servicegen/values.staging.ovh.yaml`
  - `helm/servicegen/values.prod.ovh.yaml`

## Runtime fix applied during deployment
Traefik initially stayed unready due:
- invalid dynamic file config (`tls` standalone)
- health probe endpoint mismatch (`/ping` returning 404)

Resolved in `helm/servicegen/charts/traefik/values.yaml`:
- removed `--providers.kubernetescrd=true` for this cluster baseline
- added `--ping.entrypoint=web`
- changed `dynamicConfig.content` to:
  - `http: {}`

Then reinstalled Traefik successfully.

## Validation commands executed

Chart lint:
```bash
helm lint ./helm/servicegen/charts/minio -f ./helm/servicegen/charts/minio/values.yaml -f ./helm/servicegen/charts/minio/values.local.yaml
helm lint ./helm/servicegen/charts/ollama -f ./helm/servicegen/charts/ollama/values.yaml -f ./helm/servicegen/charts/ollama/values.local.yaml
helm lint ./helm/servicegen/charts/traefik -f ./helm/servicegen/charts/traefik/values.yaml -f ./helm/servicegen/charts/traefik/values.local.yaml
```

Umbrella deps/lint:
```bash
helm dependency update ./helm/servicegen
helm lint ./helm/servicegen -f ./helm/servicegen/values.local.yaml
```

Deploy commands:
```bash
helm upgrade --install minio ./helm/servicegen/charts/minio \
  -n servicegen --create-namespace \
  -f ./helm/servicegen/charts/minio/values.yaml \
  -f ./helm/servicegen/charts/minio/values.local.yaml \
  --wait --timeout 12m

helm upgrade --install ollama ./helm/servicegen/charts/ollama \
  -n servicegen --create-namespace \
  -f ./helm/servicegen/charts/ollama/values.yaml \
  -f ./helm/servicegen/charts/ollama/values.local.yaml \
  --wait --timeout 12m

helm upgrade --install traefik ./helm/servicegen/charts/traefik \
  -n servicegen --create-namespace \
  -f ./helm/servicegen/charts/traefik/values.yaml \
  -f ./helm/servicegen/charts/traefik/values.local.yaml \
  --wait --timeout 12m
```

## Runtime verification (live cluster)
- `helm status minio -n servicegen` => `STATUS: deployed`
- `helm status ollama -n servicegen` => `STATUS: deployed`
- `helm status traefik -n servicegen` => `STATUS: deployed`

Pods:
- `minio-...` => `1/1 Running`
- `ollama-...` => `1/1 Running`
- `traefik-...` => `1/1 Running`
- `postgres-postgres-0` => `1/1 Running`

Services:
- `minio` => `9000/9001`
- `ollama` => `11434`
- `traefik` => `80/443` (NodePort local profile)

## Local deployment map
```bash
helm dependency update ./helm/servicegen

helm upgrade --install minio ./helm/servicegen/charts/minio \
  -n servicegen --create-namespace \
  -f ./helm/servicegen/charts/minio/values.yaml \
  -f ./helm/servicegen/charts/minio/values.local.yaml \
  --wait --timeout 12m

helm upgrade --install ollama ./helm/servicegen/charts/ollama \
  -n servicegen --create-namespace \
  -f ./helm/servicegen/charts/ollama/values.yaml \
  -f ./helm/servicegen/charts/ollama/values.local.yaml \
  --wait --timeout 12m

helm upgrade --install traefik ./helm/servicegen/charts/traefik \
  -n servicegen --create-namespace \
  -f ./helm/servicegen/charts/traefik/values.yaml \
  -f ./helm/servicegen/charts/traefik/values.local.yaml \
  --wait --timeout 12m

kubectl get pods -n servicegen | egrep 'minio|ollama|traefik|postgres'
kubectl get svc -n servicegen | egrep 'minio|ollama|traefik|postgres'
```
