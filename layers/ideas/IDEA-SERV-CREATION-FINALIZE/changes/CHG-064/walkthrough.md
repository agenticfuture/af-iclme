# CHG-064 Walkthrough - Local Values and MinIO Localhost Exposure Correction

## Why
Previous command examples used `values.prod.ovh.yaml`. For local cluster deployment this is incorrect.

## Correction Applied
1. Use `values.local.yaml` for local Helm install/upgrade commands.
2. For MinIO local access, use localhost port exposure matching compose mapping:
   - API: `9000`
   - Console: `9001`

## Compose Reference
From `docker-compose.dev.yml` and `docker-compose.staging.yml` MinIO mappings are:
- `9000:9000`
- `9001:9001`

## K8s Local Exposure Method
Use port-forward against MinIO service (release name `minio`):

```bash
kubectl -n servicegen port-forward svc/minio-minio 9000:9000 9001:9001
```

Then access:
- `http://localhost:9000`
- `http://localhost:9001`

## Correct Local Helm Commands

```bash
kubectl create namespace servicegen --dry-run=client -o yaml | kubectl apply -f -

helm upgrade --install traefik ./helm/servicegen/charts/traefik \
  -n servicegen \
  -f ./helm/servicegen/charts/traefik/values.yaml

helm upgrade --install postgres ./helm/servicegen/charts/postgres \
  -n servicegen \
  -f ./helm/servicegen/charts/postgres/values.yaml \
  -f ./helm/servicegen/charts/postgres/values.local.yaml

helm upgrade --install minio ./helm/servicegen/charts/minio \
  -n servicegen \
  -f ./helm/servicegen/charts/minio/values.yaml \
  -f ./helm/servicegen/charts/minio/values.local.yaml

helm upgrade --install keycloak ./helm/servicegen/charts/keycloak \
  -n servicegen \
  -f ./helm/servicegen/charts/keycloak/values.yaml \
  -f ./helm/servicegen/charts/keycloak/values.local.yaml

helm upgrade --install service-gen-api ./helm/servicegen/charts/service-gen-api \
  -n servicegen \
  -f ./helm/servicegen/charts/service-gen-api/values.yaml \
  -f ./helm/servicegen/charts/service-gen-api/values.local.yaml

helm upgrade --install service-gen-saas ./helm/servicegen/charts/service-gen-saas \
  -n servicegen \
  -f ./helm/servicegen/charts/service-gen-saas/values.yaml \
  -f ./helm/servicegen/charts/service-gen-saas/values.local.yaml

helm upgrade --install service-gen-ai-chatbot ./helm/servicegen/charts/service-gen-ai-chatbot \
  -n servicegen \
  -f ./helm/servicegen/charts/service-gen-ai-chatbot/values.yaml \
  -f ./helm/servicegen/charts/service-gen-ai-chatbot/values.local.yaml
```

## Local Verification Commands

```bash
kubectl get pods -n servicegen
kubectl get svc -n servicegen
kubectl get ingress -n servicegen

# MinIO localhost exposure
kubectl -n servicegen port-forward svc/minio-minio 9000:9000 9001:9001
```
