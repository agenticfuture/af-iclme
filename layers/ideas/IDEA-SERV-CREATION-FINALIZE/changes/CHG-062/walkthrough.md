# CHG-062 Walkthrough - Helm Updates for SaaS and Chatbot

## Scope
Updated Helm charts for:
- `service-gen-saas`
- `service-gen-ai-chatbot`

Aligned with compose/env context and already built images.

## Images Used
- `ghcr.io/agenticfuture/servicegen-saas:0.8.0`
- `ghcr.io/agenticfuture/servicegen-chatbot:0.8.0`

## Files Updated
### SaaS chart
- `helm/servicegen/charts/service-gen-saas/Chart.yaml`
- `helm/servicegen/charts/service-gen-saas/values.yaml`
- `helm/servicegen/charts/service-gen-saas/values.local.yaml`
- `helm/servicegen/charts/service-gen-saas/values.staging.ovh.yaml`
- `helm/servicegen/charts/service-gen-saas/values.prod.ovh.yaml`
- `helm/servicegen/charts/service-gen-saas/templates/_helpers.tpl`
- `helm/servicegen/charts/service-gen-saas/templates/configmap.yaml`
- `helm/servicegen/charts/service-gen-saas/templates/secret.yaml`
- `helm/servicegen/charts/service-gen-saas/templates/deployment.yaml`
- `helm/servicegen/charts/service-gen-saas/templates/service.yaml`
- `helm/servicegen/charts/service-gen-saas/templates/hpa.yaml`
- `helm/servicegen/charts/service-gen-saas/templates/ingress.yaml`
- `helm/servicegen/charts/service-gen-saas/templates/serviceaccount.yaml`

### Chatbot chart
- `helm/servicegen/charts/service-gen-ai-chatbot/Chart.yaml`
- `helm/servicegen/charts/service-gen-ai-chatbot/values.yaml`
- `helm/servicegen/charts/service-gen-ai-chatbot/values.local.yaml`
- `helm/servicegen/charts/service-gen-ai-chatbot/values.staging.ovh.yaml`
- `helm/servicegen/charts/service-gen-ai-chatbot/values.prod.ovh.yaml`
- `helm/servicegen/charts/service-gen-ai-chatbot/templates/_helpers.tpl`
- `helm/servicegen/charts/service-gen-ai-chatbot/templates/configmap.yaml`
- `helm/servicegen/charts/service-gen-ai-chatbot/templates/secret.yaml`
- `helm/servicegen/charts/service-gen-ai-chatbot/templates/deployment.yaml`
- `helm/servicegen/charts/service-gen-ai-chatbot/templates/service.yaml`
- `helm/servicegen/charts/service-gen-ai-chatbot/templates/hpa.yaml`
- `helm/servicegen/charts/service-gen-ai-chatbot/templates/ingress.yaml`
- `helm/servicegen/charts/service-gen-ai-chatbot/templates/serviceaccount.yaml`

### Umbrella values
- `helm/servicegen/values.local.yaml`
- `helm/servicegen/values.staging.ovh.yaml`
- `helm/servicegen/values.prod.ovh.yaml`

## Key Improvements
1. Removed broken template patterns causing parse failures.
2. Added consistent helpers, labels/selectors, and serviceAccount support.
3. Split envs into `envConfig` and `envSecret`.
4. Added resources, probes, autoscaling metrics, ingress controls.
5. Added local/staging/prod environment overlays for each chart.
6. Wired umbrella values to consume built image tags.

## Verification Performed
### SaaS
- `helm lint helm/servicegen/charts/service-gen-saas`
- `helm lint ... -f values.local.yaml`
- `helm lint ... -f values.staging.ovh.yaml`
- `helm lint ... -f values.prod.ovh.yaml`
- `helm template` on base/local/staging/prod

### Chatbot
- `helm lint helm/servicegen/charts/service-gen-ai-chatbot`
- `helm lint ... -f values.local.yaml`
- `helm lint ... -f values.staging.ovh.yaml`
- `helm lint ... -f values.prod.ovh.yaml`
- `helm template` on base/local/staging/prod

## Verification Result
- Target charts (`service-gen-saas`, `service-gen-ai-chatbot`) pass lint + template.
- Umbrella rendering is currently blocked by unrelated chart parse issue:
  - `service-gen-control-plane/templates/secret.yaml` (same legacy syntax issue).

## Deployment Examples
```bash
helm upgrade --install service-gen-saas ./helm/servicegen/charts/service-gen-saas \
  -n servicegen --create-namespace \
  -f ./helm/servicegen/charts/service-gen-saas/values.yaml \
  -f ./helm/servicegen/charts/service-gen-saas/values.staging.ovh.yaml

helm upgrade --install service-gen-ai-chatbot ./helm/servicegen/charts/service-gen-ai-chatbot \
  -n servicegen --create-namespace \
  -f ./helm/servicegen/charts/service-gen-ai-chatbot/values.yaml \
  -f ./helm/servicegen/charts/service-gen-ai-chatbot/values.staging.ovh.yaml
```
