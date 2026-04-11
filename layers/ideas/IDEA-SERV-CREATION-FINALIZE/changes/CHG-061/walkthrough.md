# CHG-061 Walkthrough - service-gen-api Helm Update

## Scope
Updated `service-gen-api` Helm chart to align with staged Docker images and env model from compose files.

## Files Updated
- `helm/servicegen/charts/service-gen-api/Chart.yaml`
- `helm/servicegen/charts/service-gen-api/values.yaml`
- `helm/servicegen/charts/service-gen-api/values.local.yaml`
- `helm/servicegen/charts/service-gen-api/values.staging.ovh.yaml`
- `helm/servicegen/charts/service-gen-api/values.prod.ovh.yaml`
- `helm/servicegen/charts/service-gen-api/templates/_helpers.tpl`
- `helm/servicegen/charts/service-gen-api/templates/configmap.yaml`
- `helm/servicegen/charts/service-gen-api/templates/secret.yaml`
- `helm/servicegen/charts/service-gen-api/templates/deployment.yaml`
- `helm/servicegen/charts/service-gen-api/templates/service.yaml`
- `helm/servicegen/charts/service-gen-api/templates/ingress.yaml`
- `helm/servicegen/charts/service-gen-api/templates/hpa.yaml`
- `helm/servicegen/charts/service-gen-api/templates/serviceaccount.yaml`
- `helm/servicegen/values.local.yaml`
- `helm/servicegen/values.staging.ovh.yaml`
- `helm/servicegen/values.prod.ovh.yaml`

## Key Changes
1. Fixed template syntax errors that prevented rendering (`unexpected "}"`).
2. Added standard Helm helpers/labels/selectors and serviceAccount support.
3. Split env configuration into:
   - `envConfig` (non-sensitive)
   - `envSecret` (sensitive)
4. Updated image defaults to built image:
   - `ghcr.io/agenticfuture/servicegen-api:0.8.0`
5. Added local/staging/prod OVH values overlays.
6. Updated probes to `/docs` to avoid failing on missing `/health` endpoint.
7. Added HPA CPU metric target and resource requests/limits.
8. Added umbrella values overrides for `service-gen-api` image and basic env/ingress settings.

## Validation Executed
- `helm lint helm/servicegen/charts/service-gen-api`
- `helm lint ... -f values.local.yaml`
- `helm lint ... -f values.staging.ovh.yaml`
- `helm lint ... -f values.prod.ovh.yaml`
- `helm template` render checks for base/local/staging/prod values.

## Validation Result
- `service-gen-api` chart: PASS (lint + template render).
- Umbrella `helm template servicegen ...`: blocked by unrelated parse error in `service-gen-saas` chart (`templates/secret.yaml`).

## Deployment Example
```bash
helm upgrade --install service-gen-api ./helm/servicegen/charts/service-gen-api \
  -n servicegen \
  --create-namespace \
  -f ./helm/servicegen/charts/service-gen-api/values.yaml \
  -f ./helm/servicegen/charts/service-gen-api/values.staging.ovh.yaml
```
