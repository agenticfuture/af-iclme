# CHG-043 Walkthrough

## Scope
Implemented an enterprise-grade Postgres Helm chart under ServiceGen umbrella based on compose env/secrets locations.

Sources used:
- `docker-compose.generated.yml`
  - `./vendor/postgres/.env`
  - `./vendor/postgres/.env.secrets`
- `docker-compose.staging.yml`
  - `./vendor/postgres/.env`

## Changes implemented

### 1) Postgres chart redesign
Updated chart:
- `helm/servicegen/charts/postgres/Chart.yaml` (version bumped to `0.2.0`)
- `helm/servicegen/charts/postgres/values.yaml` (enterprise-grade defaults)

Added/updated templates:
- `_helpers.tpl`
- `configmap.yaml`
- `secret.yaml`
- `serviceaccount.yaml`
- `service.yaml` (headless + cluster service)
- `statefulset.yaml`
- `networkpolicy.yaml`
- `pdb.yaml`
- `migration-job.yaml` (Helm hook)

Removed non-applicable templates for DB:
- `hpa.yaml`
- `ingress.yaml`

Features now covered:
- StatefulSet + PVC
- Secrets + ConfigMap
- Service(s)
- NetworkPolicy
- Resource requests/limits
- Startup/Readiness/Liveness probes (`pg_isready`)
- Optional init SQL bootstrap scripts (`initdb.scripts`)
- Optional post-install/post-upgrade migration Job hook

### 2) Environment-separated values
Added chart-level profiles:
- `helm/servicegen/charts/postgres/values.local.yaml`
- `helm/servicegen/charts/postgres/values.staging.yaml`
- `helm/servicegen/charts/postgres/values.ovh.yaml`

Added umbrella overlays:
- `helm/servicegen/values.local.yaml`
- `helm/servicegen/values.staging.yaml`
- `helm/servicegen/values.ovh.yaml`

### 3) Umbrella dependency alignment
Updated umbrella dependency version:
- `helm/servicegen/Chart.yaml`
  - `postgres` dependency `0.1.0` -> `0.2.0`

### 4) Deployment map documentation
Added:
- `helm/servicegen/charts/postgres/README.md`

Contains:
- local standalone deployment commands
- umbrella deployment commands
- staging/OVH command map
- operational notes (secrets strategy, initdb behavior, migration hook)

## Verification
Standalone postgres chart checks:
- `helm template` local profile: OK
- `helm template` staging profile: OK
- `helm template` ovh profile: OK
- `helm lint` (local/staging/ovh): OK

Umbrella render:
- blocked by pre-existing parse error in unrelated chart:
  - `servicegen/charts/service-gen-saas/templates/secret.yaml`
- This is outside postgres scope; postgres chart itself renders/lints successfully.

## Local Deployment (clear map)
See:
- `helm/servicegen/charts/postgres/README.md`

Primary command (standalone):
```bash
helm upgrade --install servicegen-postgres \
  helm/servicegen/charts/postgres \
  -n servicegen --create-namespace \
  -f helm/servicegen/charts/postgres/values.yaml \
  -f helm/servicegen/charts/postgres/values.local.yaml
```
