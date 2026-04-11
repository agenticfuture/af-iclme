# CHG-056 Walkthrough

## Scope
Analyze chatbot container strategy and fix build/runtime concerns:
- Dev compose uses `pnpm install && pnpm db:migrate && pnpm dev`.
- Staging/prod image path uses `Dockerfile.chatbot` and `pnpm build` during image build.
- Ensure migrations are not run implicitly during image build.

## Findings

### 1) Dev vs staging/prod command difference is expected
- `docker-compose.generated.yml` uses `node:20-alpine` + bind mount + runtime install/dev command.
- `docker-compose.staging.yml` uses prebuilt image (`Dockerfile.chatbot`, target `staging`) without bind mounts.

This is normal:
- Development: fast iteration, mutable container, `pnpm dev`.
- Staging/Prod: immutable image, reproducible startup.

### 2) Problem identified in chatbot build script
File: `ui-apps/service-gen-ai-chatbot/package.json`

Previous behavior:
- `build`: `tsx lib/db/migrate && next build`

Impact:
- DB migration runs during Docker image build.
- Image build becomes environment-coupled to DB reachability.
- Violates separation of concerns (build artifact creation vs deployment-time schema changes).

### 3) Migration should be an explicit deploy step
For staging/prod, schema migration should run as:
- one-off release job/container task, or
- explicit CI/CD step before promoting traffic.

Not as part of image build.

## Changes implemented

### A) Script separation in chatbot package
Updated file:
- `ui-apps/service-gen-ai-chatbot/package.json`

Changes:
- `build` => `next build`
- Added `build:with-migrate` => `tsx lib/db/migrate && next build`

Result:
- Default image build is clean and deterministic.
- Migration remains available explicitly when needed.

## Why this is the correct enterprise pattern
- Build stage: compile app, optimize output, no external mutable side effects.
- Deploy stage: controlled migration with observability and rollback gates.
- Runtime stage: app starts with already-compatible schema.

## Recommended staging/prod migration flow
1. Build and push image.
2. Run one-off migration task:
   - `pnpm db:migrate`
3. Roll out app deployment.
4. Validate health/readiness.

## Commands reference

Build chatbot image (staging compose):
```bash
docker compose --env-file .env.local -f docker-compose.staging.yml build service-gen-ai-chatbot
```

Run migration explicitly (example one-off):
```bash
docker compose --env-file .env.local -f docker-compose.staging.yml run --rm service-gen-ai-chatbot pnpm db:migrate
```

Start service:
```bash
docker compose --env-file .env.local -f docker-compose.staging.yml up -d service-gen-ai-chatbot
```

## Final status
- Chatbot image build path corrected.
- Migration no longer coupled to image build by default.
- Dev/staging/prod approach now aligned with production-grade container practices.
