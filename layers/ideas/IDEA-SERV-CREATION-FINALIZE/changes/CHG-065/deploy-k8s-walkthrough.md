# Local Kubernetes Deployment Walkthrough (ServiceGen)

## Scope

This walkthrough documents the local `kind` + Helm deployment for the ServiceGen stack and the Make targets added to make the deployment reproducible.

Deployed components (local):

1. `traefik`
2. `postgres`
3. `minio`
4. `qdrant`
5. `ollama`
6. `keycloak`
7. `service-gen-api`
8. `service-gen-ai-chatbot`
9. `service-gen-saas`

## Prerequisites

1. `kind`
2. `kubectl`
3. `helm`
4. `docker`
5. Local wildcard certs present in:
   - `./certs/_wildcard.servicegen.local.pem`
   - `./certs/_wildcard.servicegen.local-key.pem`
6. Local images already built and available in Docker:
   - `ghcr.io/agenticfuture/servicegen-api:0.8.0`
   - `ghcr.io/agenticfuture/servicegen-chatbot:0.8.0`
   - `ghcr.io/agenticfuture/servicegen-saas:0.8.0`

## Files Added / Updated

### Make targets

1. `make/k8s.mk` (new)
2. `Makefile` (includes `make/k8s.mk`)

### kind local config

1. `kind.servicegen.local.yaml` updated with host port mappings for:
   - `80 -> 30080` (Traefik HTTP)
   - `443 -> 30443` (Traefik HTTPS)
   - `19000 -> 30900` (MinIO API NodePort; `9000` is occupied by Docker Desktop on this workstation)
   - `9001 -> 30901` (MinIO Console NodePort)
   - `6333 -> 31633` (Qdrant HTTP NodePort)
   - `6334 -> 31634` (Qdrant gRPC NodePort)
   - `11434 -> 31434` (Ollama HTTP API NodePort)

### Qdrant chart

`helm/servicegen/charts/qdrant` was upgraded from a placeholder chart to a usable StatefulSet chart with:

1. StatefulSet + PVC
2. Service + optional local NodePort service
3. ConfigMap / optional Secret
4. Ingress / NetworkPolicy / PDB / HPA templates
5. Local volume permissions init-container (for `kind`)
6. Qdrant storage/snapshots paths forced into PVC to avoid container filesystem write errors

## Secret Injection Strategy (No secrets in Helm values)

Secrets are created in Kubernetes before Helm installs.

Targets:

1. `make k8s-secret-traefik-certs`
2. `make k8s-secret-api`
3. `make k8s-secret-keycloak`
4. `make k8s-secret-chatbot`
5. `make k8s-secret-saas`
6. `make k8s-secret-minio`
7. `make k8s-secrets-all`

Source files:

1. `./.env.secrets` -> `service-gen-api-secret`
2. `./vendor/keycloak/.env.secrets` -> `keycloak-auth`
3. `./ui-apps/service-gen-ai-chatbot/.env.secrets` -> `service-gen-ai-chatbot-secret`
4. `./ui-apps/service-gen-saas/.env.secrets` -> `service-gen-saas-secret`
5. `./vendor/minio/.env.secrets` -> `minio-auth`
6. `./certs/*` -> `traefik-local-certs` (TLS secret)

## Per-Chart Deploy Targets

Infrastructure:

1. `make k8s-deploy-traefik`
2. `make k8s-deploy-postgres`
3. `make k8s-deploy-minio`
4. `make k8s-deploy-qdrant`
5. `make k8s-deploy-ollama`

Applications:

1. `make k8s-deploy-keycloak`
2. `make k8s-deploy-api`
3. `make k8s-deploy-chatbot`
4. `make k8s-deploy-saas`

## Ordered Group Targets

1. `make k8s-deploy-infra`
2. `make k8s-deploy-apps`
3. `make k8s-deploy-all`

`k8s-deploy-all` includes:

1. Namespace creation
2. Secret injection
3. Local image import into the `kind` cluster for API / chatbot / SaaS (`kind load docker-image`)
4. Ordered Helm installs/upgrades

## Cluster Lifecycle Targets

1. `make k8s-local-cluster-delete`
2. `make k8s-local-cluster-create`
3. `make k8s-local-cluster-recreate`
4. `make k8s-local-rebuild-all`

`k8s-local-rebuild-all` performs:

1. Delete cluster
2. Recreate cluster with local port mappings (`kind.servicegen.local.yaml`)
3. Deploy all components (with secret injection + image imports)
4. Run verification targets

## Verification Targets

1. `make k8s-verify-core`
2. `make k8s-verify-ingress`
3. `make k8s-verify-all`

Expected endpoints after successful deploy:

1. `https://api.servicegen.local/docs`
2. `https://auth.servicegen.local`
3. `https://bot.servicegen.local`
4. `https://saas.servicegen.local`

Expected local persistent NodePort endpoints (after cluster recreate using updated kind config):

1. MinIO Console: `http://127.0.0.1:9001/`
2. MinIO API: `http://127.0.0.1:19000/`
3. Qdrant UI/API: `http://127.0.0.1:6333/dashboard`
4. Qdrant gRPC: `127.0.0.1:6334`
5. Ollama HTTP API: `http://127.0.0.1:11434/`

## Manual Command Flow (Equivalent to Make Targets)

### 1. Recreate cluster

```bash
kind delete cluster --name servicegen
kind create cluster --config ./kind.servicegen.local.yaml
```

### 2. Inject secrets

```bash
kubectl create namespace servicegen --dry-run=client -o yaml | kubectl apply -f -

kubectl -n servicegen create secret tls traefik-local-certs \
  --cert=./certs/_wildcard.servicegen.local.pem \
  --key=./certs/_wildcard.servicegen.local-key.pem \
  --dry-run=client -o yaml | kubectl apply -f -

kubectl -n servicegen create secret generic service-gen-api-secret \
  --from-env-file=./.env.secrets --dry-run=client -o yaml | kubectl apply -f -

kubectl -n servicegen create secret generic keycloak-auth \
  --from-env-file=./vendor/keycloak/.env.secrets --dry-run=client -o yaml | kubectl apply -f -

kubectl -n servicegen create secret generic service-gen-ai-chatbot-secret \
  --from-env-file=./ui-apps/service-gen-ai-chatbot/.env.secrets --dry-run=client -o yaml | kubectl apply -f -

kubectl -n servicegen create secret generic service-gen-saas-secret \
  --from-env-file=./ui-apps/service-gen-saas/.env.secrets --dry-run=client -o yaml | kubectl apply -f -

kubectl -n servicegen create secret generic minio-auth \
  --from-env-file=./vendor/minio/.env.secrets --dry-run=client -o yaml | kubectl apply -f -
```

### 3. Import local app images into kind node runtime

Use the Make targets (recommended):

```bash
make k8s-kind-import-app-images
```

### 4. Deploy infrastructure charts

```bash
make k8s-deploy-traefik
make k8s-deploy-postgres
make k8s-deploy-minio
make k8s-deploy-qdrant
make k8s-deploy-ollama
```

### 5. Deploy application charts

```bash
make k8s-deploy-keycloak
make k8s-deploy-api
make k8s-deploy-chatbot
make k8s-deploy-saas
```

### 6. Verify

```bash
make k8s-verify-all
```

## One-Command Local Rebuild

```bash
make k8s-local-rebuild-all
```

## Notes / Troubleshooting

### Qdrant on `kind` PVCs

Qdrant failed initially with permission errors on local PVCs (`Permission denied` for snapshots). Fixes applied:

1. volume permissions init-container (`busybox`, root `chown`)
2. Qdrant storage/snapshots paths set to writable PVC paths:
   - `/qdrant/storage/storage`
   - `/qdrant/storage/snapshots`

### Local images and `kind`

`kind` does not use host Docker images directly. App images must be imported into the `kind` cluster. The Make targets use `kind load docker-image`, which internally exports/imports the image and can take a long time for very large images (notably `servicegen-api`).

### Secrets bootstrap behavior (Keycloak)

Changing `keycloak-auth` secret does not rotate admin credentials in an already initialized DB. Admin bootstrap env vars only apply on first Keycloak DB initialization.
