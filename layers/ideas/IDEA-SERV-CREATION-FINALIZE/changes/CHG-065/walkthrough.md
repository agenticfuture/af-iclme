# CHG-065 Walkthrough - service-gen-api Local Kubernetes Deployment (Traefik TLS + Host Routing)

## Objective
Deploy `service-gen-api` locally on Kubernetes with Helm under `servicegen`, routed through Traefik at:
- `https://api.servicegen.local`

using:
- local wildcard certs from `./certs`
- host port exposure `80/443`
- local API image (no registry pull)
- secrets loaded from `.env.secrets`

## Final Outcome (Verified)
1. `service-gen-api` deployed and healthy (`1/1 Running`).
2. Traefik routes `api.servicegen.local` to the API service.
3. TLS terminates on Traefik using local wildcard certificate (`mkcert`).
4. Direct host access works:

```bash
curl -k https://api.servicegen.local/docs
```

Returns `HTTP/2 200`.

## Root Causes Fixed During Deployment

### 1. Local Docker image was not visible to Kubernetes (kind)
`kind` nodes use their own container runtime (containerd). Images in host Docker are not automatically visible.

Observed behavior:
- Kubernetes attempted pulls from Docker Hub or GHCR depending on image reference.
- GHCR anonymous pull failed (`403 Forbidden`) for `ghcr.io/agenticfuture/servicegen-api:0.8.0`.

Fix applied:
- Import the API image into the kind node runtime directly.

### 2. API secrets were embedded in Helm values / chart-generated secret path
The API chart initially rendered a `Secret` from `values.yaml`, which is not ideal for secret hygiene and caused runtime secret management coupling.

Fix applied:
- Refactored API chart to reference an existing Kubernetes secret (`service-gen-api-secret`).
- Created that secret from `.env.secrets` before installing the API chart.

### 3. Traefik ingress route returned 404 despite ingress existing
Issues found:
- Traefik local config included malformed file-provider config (`http: {}`) causing config build errors.
- No `IngressClass` resource (`traefik`) existed for the API ingress class reference.

Fix applied:
- Added `IngressClass` resource to Traefik chart.
- Fixed local Traefik values to avoid invalid file-provider config during initial HTTP-only routing tests.
- Later re-enabled file-provider only with valid TLS certificate config.

### 4. `api.servicegen.local` not reachable directly from host
Even after ingress was correct, host `:443` was not listening.

Root cause:
- Existing kind cluster only exposed Kubernetes API (`6443`), not Traefik ports.

Fix applied:
- Recreated kind cluster with host port mappings:
  - `80 -> 30080`
  - `443 -> 30443`

## Helm / Chart Changes Applied

### service-gen-api chart
Files updated:
- `helm/servicegen/charts/service-gen-api/templates/deployment.yaml`
- `helm/servicegen/charts/service-gen-api/templates/secret.yaml`
- `helm/servicegen/charts/service-gen-api/values.yaml`
- `helm/servicegen/charts/service-gen-api/values.local.yaml`

Key changes:
1. Deployment now references an existing secret name via values (`secret.existingSecretName`).
2. Chart secret creation is optional (`secret.createFromValues`), disabled for local deployment.
3. Removed embedded secret values from API chart values.
4. Enabled local API ingress with Traefik and TLS annotations:
   - `traefik.ingress.kubernetes.io/router.entrypoints: websecure`
   - `traefik.ingress.kubernetes.io/router.tls: "true"`

### Traefik chart
Files updated:
- `helm/servicegen/charts/traefik/templates/service.yaml`
- `helm/servicegen/charts/traefik/templates/ingressclass.yaml` (new)
- `helm/servicegen/charts/traefik/values.yaml`
- `helm/servicegen/charts/traefik/values.local.yaml`

Key changes:
1. Added `IngressClass` (`traefik`).
2. Added fixed local NodePorts for deterministic host mapping:
   - `30080` (`web`)
   - `30443` (`websecure`)
3. Added local TLS cert configuration matching compose cert paths:
   - `/certs/_wildcard.servicegen.local.pem`
   - `/certs/_wildcard.servicegen.local-key.pem`
4. Mounted certs from Kubernetes secret (`traefik-local-certs`).

### kind cluster config (new)
File added:
- `kind.servicegen.local.yaml`

Purpose:
- Publish host `80/443` into the kind control-plane node for local domain access.

## Certificate Source (Compose Parity)
Compose reference (`docker-compose.generated.yml`) uses:
- mount `./certs:/certs`
- wildcard files:
  - `/certs/_wildcard.servicegen.local.pem`
  - `/certs/_wildcard.servicegen.local-key.pem`

Helm local Traefik config was aligned to use the same file names/paths.

## End-to-End Deployment Steps Performed

### 1. Recreate kind cluster with host 80/443 mappings
```bash
kind delete cluster --name servicegen
kind create cluster --config ./kind.servicegen.local.yaml
```

Verified host port mappings:
- `0.0.0.0:80 -> 30080/tcp`
- `0.0.0.0:443 -> 30443/tcp`

### 2. Create namespace
```bash
kubectl create namespace servicegen --dry-run=client -o yaml | kubectl apply -f -
```

### 3. Create Traefik TLS cert secret from local certs
```bash
kubectl create secret generic traefik-local-certs \
  -n servicegen \
  --from-file=_wildcard.servicegen.local.pem=./certs/_wildcard.servicegen.local.pem \
  --from-file=_wildcard.servicegen.local-key.pem=./certs/_wildcard.servicegen.local-key.pem \
  --dry-run=client -o yaml | kubectl apply -f -
```

### 4. Install Traefik
```bash
helm install traefik ./helm/servicegen/charts/traefik \
  -n servicegen \
  -f ./helm/servicegen/charts/traefik/values.yaml \
  -f ./helm/servicegen/charts/traefik/values.local.yaml \
  --wait --timeout 10m
```

Note:
- First Traefik pod failed if cert secret was not present before install.
- Restarting/deleting the pod after secret creation resolved the mount issue.

### 5. Import local API image into kind node runtime
Because GHCR anonymous pulls failed, image was imported directly into the node runtime.

Verified node runtime availability:
```bash
docker exec servicegen-control-plane crictl images | rg 'ghcr.io/agenticfuture/servicegen-api'
```

### 6. Create API secret from `.env.secrets`
```bash
kubectl create secret generic service-gen-api-secret \
  -n servicegen \
  --from-env-file=.env.secrets \
  --dry-run=client -o yaml | kubectl apply -f -
```

### 7. Install API chart
```bash
helm install service-gen-api ./helm/servicegen/charts/service-gen-api \
  -n servicegen \
  -f ./helm/servicegen/charts/service-gen-api/values.yaml \
  -f ./helm/servicegen/charts/service-gen-api/values.local.yaml \
  --set image.repository=ghcr.io/agenticfuture/servicegen-api \
  --set image.tag=0.8.0 \
  --set image.pullPolicy=IfNotPresent \
  --wait --timeout 10m
```

### 8. Verify direct host HTTPS routing
```bash
curl -k https://api.servicegen.local/docs
```

Observed:
- TLS handshake succeeds with local wildcard cert.
- Response `HTTP/2 200` from API (`uvicorn`).

## Validation Checklist (Completed)
- [x] Traefik pod running
- [x] Traefik ingress class exists (`traefik`)
- [x] API ingress created for `api.servicegen.local`
- [x] API image loaded in kind node runtime
- [x] API secret created from `.env.secrets`
- [x] API pod `1/1 Running`
- [x] `curl -k https://api.servicegen.local/docs` returns 200

## Reusable Commands (Current Working Local Flow)

```bash
# Cluster (host ports 80/443)
kind create cluster --config ./kind.servicegen.local.yaml

# Namespace
kubectl create namespace servicegen --dry-run=client -o yaml | kubectl apply -f -

# Traefik cert secret
kubectl create secret generic traefik-local-certs \
  -n servicegen \
  --from-file=_wildcard.servicegen.local.pem=./certs/_wildcard.servicegen.local.pem \
  --from-file=_wildcard.servicegen.local-key.pem=./certs/_wildcard.servicegen.local-key.pem \
  --dry-run=client -o yaml | kubectl apply -f -

# Traefik
helm upgrade --install traefik ./helm/servicegen/charts/traefik \
  -n servicegen \
  -f ./helm/servicegen/charts/traefik/values.yaml \
  -f ./helm/servicegen/charts/traefik/values.local.yaml \
  --wait --timeout 10m

# API app secret
kubectl create secret generic service-gen-api-secret \
  -n servicegen \
  --from-env-file=.env.secrets \
  --dry-run=client -o yaml | kubectl apply -f -

# API chart
helm upgrade --install service-gen-api ./helm/servicegen/charts/service-gen-api \
  -n servicegen \
  -f ./helm/servicegen/charts/service-gen-api/values.yaml \
  -f ./helm/servicegen/charts/service-gen-api/values.local.yaml \
  --set image.repository=ghcr.io/agenticfuture/servicegen-api \
  --set image.tag=0.8.0 \
  --set image.pullPolicy=IfNotPresent \
  --wait --timeout 10m

# Verify
kubectl get pods -n servicegen
kubectl get ingress -n servicegen
curl -k https://api.servicegen.local/docs
```

## Next Step
Proceed to local Kubernetes deployment of `postgres` chart on the recreated cluster (same `servicegen` namespace), then verify database initialization (including DB creation/init job behavior).
