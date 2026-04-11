# Tenant Registration - Phase 1 Walkthrough

Timestamp: 2026-02-24 20:10:06 AST
Scope: Phase 1 only (tenant domain scaffold)
Status: Completed and validated in `service-gen-api` Docker container

## 1. Goal
Implement the Phase 1 foundation for the `tenant` domain based on the saved implementation plan:
- object-based factory (`TenantDomain`)
- cross-domain facade (`tenant_domain_api`)
- contracts (entities/errors/events)
- shared utilities (logging/error mapping/state machine/idempotency/event signing)
- tenant-owned DB adapter scaffold (models/repositories/migrations scaffold)
- initial unit tests

No business registration logic, Keycloak/OPA adapters, or SaaS refactor in this phase.

## 2. Files Added (Phase 1)
### Domain package + factory
- `capabilities/tenant/__init__.py`
- `capabilities/tenant/factory.py`

### Contracts
- `capabilities/tenant/contracts/__init__.py`
- `capabilities/tenant/contracts/entities.py`
- `capabilities/tenant/contracts/errors.py`
- `capabilities/tenant/contracts/events.py`

### Shared utilities
- `capabilities/tenant/shared/__init__.py`
- `capabilities/tenant/shared/constants.py`
- `capabilities/tenant/shared/logging.py`
- `capabilities/tenant/shared/context.py`
- `capabilities/tenant/shared/error_mapping.py`
- `capabilities/tenant/shared/state_machine.py`
- `capabilities/tenant/shared/idempotency.py`
- `capabilities/tenant/shared/event_signing.py`

### Tenant DB adapter scaffold
- `capabilities/tenant/adapters/db/__init__.py`
- `capabilities/tenant/adapters/db/base.py`
- `capabilities/tenant/adapters/db/engine.py`
- `capabilities/tenant/adapters/db/session.py`
- `capabilities/tenant/adapters/db/models/__init__.py`
- `capabilities/tenant/adapters/db/models/mixins.py`
- `capabilities/tenant/adapters/db/models/core_projection.py`
- `capabilities/tenant/adapters/db/models/registration.py`
- `capabilities/tenant/adapters/db/repositories/__init__.py`
- `capabilities/tenant/adapters/db/repositories/core_identity_projection_repository.py`
- `capabilities/tenant/adapters/db/repositories/tenant_registration_repository.py`
- `capabilities/tenant/adapters/db/migrations/README.md`
- `capabilities/tenant/adapters/db/migrations/versions/0000_scaffold_placeholder.py`

### Unit tests
- `capabilities/tenant/tests/unit/test_state_machine.py`
- `capabilities/tenant/tests/unit/test_factory_contract.py`

## 3. Key Design Outcomes Implemented
1. `TenantDomain` is an object (not only a mount function).
2. `tenant_domain_api` is exported as a separate cross-domain facade object.
3. Package init was kept lightweight so importing `capabilities.tenant.shared.*` does not force `fastapi` import.
4. Tenant domain carries copied/refactored core projection models (`Tenant`, `Organization`, `User`, `UserPII`) plus tenant-owned registration/evidence models in its DB adapter scaffold.
5. `workflow_v0.8.1` state ordering and transition validation are represented in `TenantRegistrationStateMachine`.

## 4. Docker Runtime Validation (API container only)
### 4.1 Context
Validation was explicitly performed inside the `service-gen-api` Docker container (as requested), using the container venv interpreter style:
- `/app/.venv/bin/python ...`

### 4.2 Compose restart (user-requested sequence)
Executed step-by-step:
1. `docker compose -f docker-compose.generated.yml down`
2. `docker compose -f docker-compose.generated.yml up -d`

Observed issue during restart:
- `servicegen-service-gen-control-plane-1` failed with:
  - `exec: "/app/migrations/alembic": is a directory`
- Per user instruction, this was ignored (focus remained on API only).

### 4.3 API container status
- `service-gen-api` initially appeared as `Created`
- started manually and confirmed running

### 4.4 In-container smoke checks (passed)
#### Command style validation
- `/app/.venv/bin/python -c "print('hello')"` -> `hello`

#### State machine smoke check
Validated in `service-gen-api` container:
- `START -> RegistrationRequested` => `True`
- `START -> APIValidated` => `False`

#### Domain factory/facade smoke check
Validated in `service-gen-api` container:
- `tenant_domain` imports
- `tenant_domain_api` imports
- `tenant_domain_api is tenant_domain.api` => `True`
- `tenant_domain.health()` returns expected metadata

## 5. Pytest Validation (API container)
### 5.1 Problem encountered
Running pytest normally in the API container hung during test collection.

### 5.2 Root cause (operational)
Pytest plugin autoload in this container environment causes the hang (likely due installed plugins/environment interaction), not the tenant test files.

### 5.3 Fix/workaround used
Disable plugin autoload for container test execution:
- `PYTEST_DISABLE_PLUGIN_AUTOLOAD=1`

### 5.4 Test runtime preparation
Installed pytest into API container venv using `uv` (user-required package manager):
- `cd /app && /app/.venv/bin/uv add --dev pytest`

### 5.5 Passing test runs (confirmed)
- `capabilities/tenant/tests/unit/test_state_machine.py` -> passed
- `capabilities/tenant/tests/unit/test_factory_contract.py` -> passed
- `capabilities/tenant/tests/unit` -> `4 passed`

Working command (canonical for this container):
```bash
docker exec service-gen-api sh -lc 'cd /app && PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 /app/.venv/bin/python -m pytest capabilities/tenant/tests/unit -q'
```

## 6. Phase 1 Completion Criteria Status
- [x] Object-based tenant factory implemented
- [x] Cross-domain facade object exported (`tenant_domain_api`)
- [x] Contracts scaffold implemented
- [x] Shared logging/error/state-machine utilities implemented
- [x] Tenant DB adapter scaffold implemented
- [x] Tenant/core projection model copies scaffolded in tenant domain adapter
- [x] Unit tests added
- [x] Docker API-container runtime smoke checks passed
- [x] Unit tests passed in Docker API container (with plugin autoload disabled)

## 7. Known Limitations (Expected for Phase 1)
1. `tenant_domain_api` methods are scaffolds and intentionally raise `*_NOT_IMPLEMENTED` errors.
2. No real registration persistence logic yet.
3. No DB migration `0001` yet (only scaffold placeholder).
4. No Keycloak adapter yet.
5. No OPA adapter/policies yet.
6. No SaaS onboarding refactor yet.

## 8. Next Phase (Phase 2)
Planned next:
1. Implement registration repositories and first real migration (`0001`)
2. Add register/status/resend/purge caps + API skeletons
3. Add Phase 2 tests
4. Validate Phase 2 in `service-gen-api` container before moving on
