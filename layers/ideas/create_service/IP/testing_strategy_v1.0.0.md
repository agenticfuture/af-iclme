# Create Service Testing Strategy v1.0.0

## Objective
Apply a layered test model that minimizes browser E2E dependency during active development while preserving high confidence on real behavior.

## Layer 1: Product Logic (Unit/Workflow)
- Capability handler/workflow/function tests with structured inputs.
- Validate state transitions and deterministic outputs for each cap step.
- No browser.

## Layer 2: Integration (API + DB + Chaining)
- Real HTTP method chains against internal endpoints (`POST/GET/PATCH/DELETE`).
- Assert DB persistence after each step and final aggregate state.
- Use artifact TTL caching to avoid recreating full setup on each run.

## Layer 3: Security
- Scope enforcement tests (`tenant_id`, `org_id`, `service_id`).
- Auth/session/token mismatch rejection tests.
- State-machine forbidden transition tests.

## Layer 4: Privacy
- Data-source prescan and PII handling tests.
- Purge/delete cascade behavior (`DB + object storage`) tests.
- Consent and retention policy checks.

## Layer 5: UI Component Behavior
- `Vitest + @testing-library/react + @testing-library/user-event + MSW`.
- Validate visibility/disable/enable/event handling and payload intent.
- No full page navigation or external IdP dependency.

## Artifact + Chunk Strategy
- Persist setup artifacts as JSON with TTL.
- Break large flows into chunk tests:
  - chunk A: create scope + seed data
  - chunk B: step transitions
  - chunk C: finalization/deploy checks
  - chunk D: status action checks
- Reuse valid artifacts; regenerate only expired/invalid chunks.

## Execution Order
1. Layer 1
2. Layer 2
3. Layer 3
4. Layer 4
5. Layer 5
6. Full browser E2E only at release gate (built app runtime).

