# Tenant Registration Implementation - Walkthrough Phase 12 (Playwright E2E)

## Scope

Phase 12 implements and validates item `4`:

- End-to-end Playwright test execution for the tenant onboarding flow (SaaS -> Tenant API)
- Reusable Docker Compose-based Playwright runner service (`playwright-test`)
- Runner assets organized under `vendor/playwright-test` as requested

## What Was Added / Changed

### 1. SaaS Playwright E2E test harness

- Added Playwright config:
  - `ui-apps/service-gen-saas/playwright.config.ts`
- Added tenant onboarding e2e spec:
  - `ui-apps/service-gen-saas/tests/e2e/tenant-onboarding.spec.ts`
- Updated `package.json` scripts:
  - `test:e2e`
  - `test:list` text
- Added `@playwright/test` to `devDependencies`

### 2. Reusable Docker Compose runner service

- Added `playwright-test` service to:
  - `docker-compose.generated.yml`
- Service uses:
  - image: `mcr.microsoft.com/playwright:v1.58.2-noble`
- Runs on the same Compose network as `service-gen-saas` and `service-gen-api`

### 3. `playwright-test` service assets moved under vendor folder (requested)

Created and mounted from:

- `vendor/playwright-test/entrypoint.sh`
- `vendor/playwright-test/node_modules/`
- `vendor/playwright-test/pnpm-store/`
- `vendor/playwright-test/cache/ms-playwright/`

Compose mounts now point to this folder for clarity and persistence.

## Runner Design Notes

The `playwright-test` service is intentionally separate from `service-gen-saas`:

- avoids reinstalling Playwright on each test run
- avoids SaaS container browser dependency issues (Alpine/musl mismatch)
- keeps runner-specific caches and dependencies isolated under `vendor/playwright-test`

The runner startup script:

1. installs `pnpm` globally
2. installs `@playwright/test` globally
3. installs SaaS workspace dependencies (once into mounted `vendor/playwright-test/node_modules`)
4. stays alive for repeated `docker exec` test runs

## Issues Encountered and Resolutions

### A. Browser launch failures in `service-gen-saas` container

- Root cause: Playwright browser binaries incompatible with Alpine/musl runtime in SaaS container.
- Resolution: use dedicated Playwright image service (`playwright-test`) instead of running browsers in `service-gen-saas`.

### B. DNS/network mismatch during `docker run` tests

- `service-gen-saas` was not resolvable on wrong network.
- Resolved by moving to a compose-managed service on the correct Compose network.

### C. `pnpm exec playwright` not found in runner

- Root cause: local workspace `@playwright/test` not guaranteed initially.
- Resolution: run Playwright via globally installed CLI in runner and set `NODE_PATH` for config imports.

### D. Next.js dev page `load` timeout

- `page.goto(..., waitUntil: "load")` was too strict in this Dockerized Next.js dev setup.
- Updated e2e test to:
  - `waitUntil: "domcontentloaded"`

## Commands Used (Final Working Flow)

### Start/Recreate runner

```bash
docker compose -f /Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/docker-compose.generated.yml up -d --force-recreate playwright-test
```

### Wait for readiness

```bash
docker logs -f playwright-test
```

Wait until:

- `Playwright test runner ready`

### Run tenant onboarding e2e

```bash
docker exec playwright-test sh -lc 'cd /work && export NODE_PATH=$(npm root -g) && playwright test tests/e2e/tenant-onboarding.spec.ts --reporter=line'
```

## Validation Result

Final result:

- `1 passed (1.2m)`

This validates the tenant onboarding flow e2e path in the current local Docker setup using the reusable `playwright-test` service.

## Phase 12 Outcome

- Playwright e2e infrastructure is implemented and reusable
- `playwright-test` service assets are organized under `vendor/playwright-test`
- Tenant onboarding e2e test passes end-to-end
