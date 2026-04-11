# Hypothesis

If we seed the `core.tenants` and `core.organizations` tables with the default UUID used by the API (`00000000-0000-0000-0000-000000000001`), the foreign key constraint on the `services` table will be satisfied, allowing the service creation wizard to hit the database successfully.

## Metrics
- Service insertion succeeds on Step 1.
- No `ForeignKeyViolation` logs in the API container.
