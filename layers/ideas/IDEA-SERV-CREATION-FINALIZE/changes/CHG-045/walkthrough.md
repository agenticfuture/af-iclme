# CHG-045 Walkthrough

## Scope
Validate and correct the Postgres chart after replacing migration hook with `postgres-db-init.job`, ensuring all values are correctly wired and chart integrity is preserved.

## Findings from audit
The custom init job had linkage mismatches:
- hardcoded secret name (`postgres-admin-secret`) not tied to chart values
- host/port source used non-canonical path (`.Values.postgres.*`)
- role passwords depended on array indexing assumptions (`users[0..2]`)
- old `migrationJob` config remained in values even though job was replaced

## Corrections implemented

### 1) Introduced canonical db-init value schema
- File: `helm/servicegen/charts/postgres/values.yaml`
- Added `postgresInitJob` block with:
  - hook policies
  - image config
  - connection (host/port/db)
  - superuser secret ref
  - role creation controls
  - role password secret mapping
  - database list
  - extra SQL
- Removed obsolete `migrationJob` schema.

### 2) Updated helper functions for secret resolution
- File: `helm/servicegen/charts/postgres/templates/_helpers.tpl`
- Added:
  - `postgres.initRolePasswordSecretName`
  - `postgres.initSuperuserSecretName`

### 3) Replaced old init job template with linked version
- Deleted: `helm/servicegen/charts/postgres/templates/postgres-init-job.yaml`
- Added: `helm/servicegen/charts/postgres/templates/postgres-db-init.job.yaml`

New job behavior:
- waits for postgres readiness
- uses values-linked host/port/db
- reads superuser credentials from chart-resolved secret
- creates/alters roles using env-backed passwords
- creates databases if missing and enforces ownership
- runs optional `extraSql`

### 4) Added optional role-password secret template
- Added: `helm/servicegen/charts/postgres/templates/postgres-db-init-secret.yaml`
- Creates a secret only when:
  - db-init enabled
  - role creation enabled
  - no external role-password secret provided

### 5) Removed leftover migration linkage from configmap
- File: `helm/servicegen/charts/postgres/templates/configmap.yaml`
- Removed old `migration.sql` emission.

### 6) Profile corrections
Updated chart profiles:
- `helm/servicegen/charts/postgres/values.local.yaml`
- `helm/servicegen/charts/postgres/values.staging.ovh.yaml`
- `helm/servicegen/charts/postgres/values.prod.ovh.yaml`

Updated umbrella overlays:
- `helm/servicegen/values.local.yaml`
- `helm/servicegen/values.staging.ovh.yaml`
- `helm/servicegen/values.prod.ovh.yaml`

All now use `postgresInitJob` and consistent key contract.

## Integrity verification
Executed and passed:
- `helm template` local profile
- `helm template` staging.ovh profile
- `helm template` prod.ovh profile
- `helm lint` local/staging.ovh/prod.ovh

## Local deployment map
```bash
# Namespace
kubectl create namespace servicegen --dry-run=client -o yaml | kubectl apply -f -

# Deploy Postgres chart (local)
helm upgrade --install servicegen-postgres \
  helm/servicegen/charts/postgres \
  -n servicegen \
  -f helm/servicegen/charts/postgres/values.yaml \
  -f helm/servicegen/charts/postgres/values.local.yaml

# Validate
kubectl -n servicegen get pods,svc,pvc,job
kubectl -n servicegen logs job/servicegen-postgres-postgres-db-init
```
