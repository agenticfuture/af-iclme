# Tenant Registration - Phase 4 Walkthrough (OPA + CI Validators Skeleton)

## Scope
- Added OPA adapter skeleton and policy files.
- Added tenant-domain CI validation scripts (workflow conformance, OPA coverage, traceability, factory contract).
- Wired policy decision recording into tenant registration skeleton behavior.
- Added Phase 4 unit tests covering:
  - OPA adapter decision behavior
  - registration policy evidence recording
  - CI validator script execution

## Files Implemented (Phase 4)
- `capabilities/tenant/adapters/opa/__init__.py`
- `capabilities/tenant/adapters/opa/policy_adapter.py`
- `capabilities/tenant/policies/tenant_registration/*.rego`
- `capabilities/tenant/ci/specs_manifest.yml`
- `capabilities/tenant/ci/scripts/validate_factory_contract.py`
- `capabilities/tenant/ci/scripts/validate_opa_coverage.py`
- `capabilities/tenant/ci/scripts/validate_traceability.py`
- `capabilities/tenant/ci/scripts/validate_workflow_v081.py`
- `capabilities/tenant/tests/unit/test_phase4_opa_and_ci_validators.py`

## Issue Found During Validation
The Phase 4 test originally referenced:
- `/app/af-iclme/layers/ideas/tenant_registration/workflow_v0.8.1.yml`

In the `service-gen-api` Docker container, `/app/af-iclme/...` was not present, causing:
- `FileNotFoundError` in `test_ci_validators_run_locally`

## Fix Applied
Updated `test_phase4_opa_and_ci_validators.py` to:
- use the repo workflow file if present
- otherwise generate a temporary minimal `workflow_v0.8.1` fixture under `/tmp`

This makes CI validator tests portable in the container runtime.

## Docker Runtime Validation (API container)
Tenant unit suite run in `service-gen-api` with plugin autoload disabled (required in this container to avoid pytest collection hangs):

```bash
docker exec service-gen-api sh -lc 'cd /app && PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 /app/.venv/bin/python -m pytest capabilities/tenant/tests/unit -q'
```

Observed result after fix:
- `12 passed in 1.39s`

## Additional Runtime Note
- `pytest` plugin autoload causes hangs in this container environment.
- Working pattern for all tenant unit tests in `service-gen-api` is:

```bash
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 /app/.venv/bin/python -m pytest ...
```

## Phase 4 Outcome
- OPA and CI validation scaffolding is in place and verified at unit level.
- Registration flow now records policy decisions in the in-memory registration skeleton.
- Next phase should focus on SaaS onboarding integration (replace placeholder onboarding/Auth0 paths with tenant-domain flow).
