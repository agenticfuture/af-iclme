# CHG-063 Walkthrough - Traefik Accessibility and Helm Release Commands

## Objective
Verify end-to-end wiring/accessibility for:
- `api.servicegen.local`
- `saas.servicegen.local`
- `bot.servicegen.local`
- `auth.servicegen.local`

And provide install/upgrade commands for related Helm releases, including MinIO.

## Checks Performed

### 1. Compose routing checks
- Parsed `docker-compose.generated.yml` and `docker-compose.staging.yml` for Traefik labels and host rules.
- Confirmed in `docker-compose.generated.yml`:
  - `api.servicegen.local` -> service-gen-api
  - `saas.servicegen.local` -> service-gen-saas
  - `bot.servicegen.local` -> service-gen-ai-chatbot
  - `auth.servicegen.local` -> keycloak

### 2. Staging compose status check
- In `docker-compose.staging.yml`, `service-gen-api`, `service-gen-saas`, and `service-gen-ai-chatbot` are present.
- `keycloak` block is commented out, so `auth.servicegen.local` is not active in staging compose path.

### 3. Runtime accessibility checks
- `curl -kI https://api.servicegen.local`
- `curl -kI https://saas.servicegen.local`
- `curl -kI https://bot.servicegen.local`
- `curl -kI https://auth.servicegen.local`
- No HTTP headers returned (not currently reachable from active runtime).

### 4. Kubernetes ingress checks
- `kubectl get ingress -A` returned no resources.
- Confirms hosts are not currently exposed via active K8s ingresses in this environment.

### 5. Helm validation checks
- `helm lint` passed for charts:
  - traefik
  - keycloak
  - minio
  - service-gen-api
  - service-gen-saas
  - service-gen-ai-chatbot
- `helm template` render checks confirm ingress host wiring in prod overlays:
  - `api.servicegen.local`
  - `saas.servicegen.local`
  - `bot.servicegen.local`
  - `auth.servicegen.local`
  - `minio.servicegen.local`
  - `minio-console.servicegen.local`

## Conclusion
- Wiring definitions are present and coherent in compose-generated and Helm manifests.
- Current environment is not exposing these hosts live yet (no running app stack + no K8s ingress resources).
- For staging compose path, `auth.servicegen.local` is missing because Keycloak is commented out there.

## Helm Release Command Set (Install/Upgrade)

```bash
# namespace
kubectl create namespace servicegen --dry-run=client -o yaml | kubectl apply -f -

# 1) Traefik
helm upgrade --install traefik ./helm/servicegen/charts/traefik \
  -n servicegen \
  -f ./helm/servicegen/charts/traefik/values.yaml

# 2) Postgres
helm upgrade --install postgres ./helm/servicegen/charts/postgres \
  -n servicegen \
  -f ./helm/servicegen/charts/postgres/values.yaml \
  -f ./helm/servicegen/charts/postgres/values.prod.ovh.yaml

# 3) MinIO (requested)
helm upgrade --install minio ./helm/servicegen/charts/minio \
  -n servicegen \
  -f ./helm/servicegen/charts/minio/values.yaml \
  -f ./helm/servicegen/charts/minio/values.prod.ovh.yaml

# 4) Keycloak (auth.servicegen.local)
helm upgrade --install keycloak ./helm/servicegen/charts/keycloak \
  -n servicegen \
  -f ./helm/servicegen/charts/keycloak/values.yaml \
  -f ./helm/servicegen/charts/keycloak/values.prod.ovh.yaml

# 5) ServiceGen API (api.servicegen.local)
helm upgrade --install service-gen-api ./helm/servicegen/charts/service-gen-api \
  -n servicegen \
  -f ./helm/servicegen/charts/service-gen-api/values.yaml \
  -f ./helm/servicegen/charts/service-gen-api/values.prod.ovh.yaml

# 6) ServiceGen SaaS (saas.servicegen.local)
helm upgrade --install service-gen-saas ./helm/servicegen/charts/service-gen-saas \
  -n servicegen \
  -f ./helm/servicegen/charts/service-gen-saas/values.yaml \
  -f ./helm/servicegen/charts/service-gen-saas/values.prod.ovh.yaml

# 7) ServiceGen Chatbot (bot.servicegen.local)
helm upgrade --install service-gen-ai-chatbot ./helm/servicegen/charts/service-gen-ai-chatbot \
  -n servicegen \
  -f ./helm/servicegen/charts/service-gen-ai-chatbot/values.yaml \
  -f ./helm/servicegen/charts/service-gen-ai-chatbot/values.prod.ovh.yaml
```

## Post-Deploy Verification Commands

```bash
kubectl get pods -n servicegen
kubectl get ingress -n servicegen
kubectl get svc -n servicegen

curl -kI https://api.servicegen.local
curl -kI https://saas.servicegen.local
curl -kI https://bot.servicegen.local
curl -kI https://auth.servicegen.local
curl -kI https://minio.servicegen.local
```
