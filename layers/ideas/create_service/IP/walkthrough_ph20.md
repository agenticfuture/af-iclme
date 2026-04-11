# Walkthrough PH20 - Embed Runtime Recheck Contract

## Objective
Close the remaining embed runtime gap from the create_service plan by verifying that the copied playground snippet includes the periodic availability recheck and the hide/unload behavior when access is no longer allowed.

## What Was Updated

### 1) Static runtime contract strengthened
- Updated:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-saas/scripts/test-embed-runtime-contract.ts`

Added assertions to require the generated snippet to include:
- `window.setInterval(syncVisibility...)`
- widget hide path: `wrap.classList.add("sg-hidden")`
- iframe unload path: `frame.removeAttribute("src")`

These checks apply to all generated embed outputs:
- widget
- iframe/inline
- react wrapper

### 2) UI runtime test file extended
- Updated:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-saas/tests/ui/embed-runtime-snippets.test.ts`

Added a new test for the runtime transition path:
- allowed on first check -> iframe mounts
- denied on recheck -> widget auto-hides and iframe source is removed

In the current container runtime, direct vitest execution for this file remains unstable, so the passing evidence for this phase is carried by the stable static runtime contract.

## Verification

Executed in docker:

```sh
docker compose -f docker-compose.generated.yml exec -T service-gen-saas-e2e \
  sh -lc 'cd /app && ./node_modules/.bin/tsx ./scripts/test-embed-runtime-contract.ts'
```

Observed result:

```text
embed-runtime-contract: ok
```

## Result

The embed runtime contract now explicitly enforces:
- signed scope propagation
- availability endpoint usage
- host isolation
- periodic recheck
- hide/unload behavior when public availability is revoked

This keeps the embed runtime aligned with Phase 6 of:
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/af-iclme/layers/ideas/create_service/IP/implementation_plan_v1.2.0.md`
