# CHG-053 Walkthrough

## Scope
Validate whether the updated Postgres Helm chart actually created all required databases after `postgres-db-init` migration replacement.

## Integrity checks executed
All passed:
- `helm lint` with local profile
- `helm lint` with staging OVH profile
- `helm lint` with prod OVH profile

## Runtime checks executed (live cluster)

### Pod and Job status
- Postgres pod: `postgres-postgres-0` => `1/1 Running`
- Init job: `postgres-postgres-db-init` => `Complete`

### Hook job logs
Observed successful completion sequence:
- Postgres readiness reached
- Role creation blocks executed (`DO`)
- DB create/owner statements executed (`CREATE DATABASE`, `ALTER DATABASE`)
- Final: `Postgres db-init job completed successfully.`

### Direct SQL verification (inside pod)

Databases present:
- `keycloak`
- `servicegen`
- `prefect`

Owners verified:
- `keycloak` -> `keycloak`
- `servicegen` -> `servicegen_api`
- `prefect` -> `prefect_`

Roles present:
- `keycloak`
- `servicegen_api`
- `prefect_`

## Conclusion
Yes, all expected databases were created successfully, roles exist, and ownership mapping is correct.

## Local deployment map (clear + verify)

```bash
helm upgrade --install postgres ./helm/servicegen/charts/postgres \
  -n servicegen \
  --create-namespace \
  -f ./helm/servicegen/charts/postgres/values.yaml \
  -f ./helm/servicegen/charts/postgres/values.local.yaml \
  --set postgresInitJob.hookEnabled=true \
  --wait --timeout 10m
```

```bash
kubectl get pods -n servicegen | grep postgres-postgres
kubectl get jobs -n servicegen | grep postgres-postgres-db-init
kubectl logs -n servicegen job/postgres-postgres-db-init
```

```bash
kubectl exec -n servicegen postgres-postgres-0 -- \
  psql -U postgres -d postgres -tAc "SELECT datname, pg_catalog.pg_get_userbyid(datdba) AS owner FROM pg_database WHERE datname IN ('keycloak','servicegen','prefect') ORDER BY datname;"
```
