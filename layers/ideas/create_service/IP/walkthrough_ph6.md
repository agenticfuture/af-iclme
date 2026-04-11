# Create Service - Phase 6 Walkthrough (Product E2E Completion)

Date: 2026-02-28

## Objective
Close remaining Product-layer partials for create-service around:
- Finish redirect behavior
- Playground mode behavior

## Root cause discovered
During browser e2e execution, wizard API calls from SaaS to `https://api.servicegen.local` failed auth because cross-origin `fetch` omitted cookies by default.

Observed symptom:
- `401` on `POST /api/service/services/{id}/agents` during Finish
- No redirect to playground

## Code corrections
1. Added `credentials: "include"` to all wizard API calls in:
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-saas/app/dashboard/services/new/page.tsx`

2. Ensured callback session cookie supports subdomain sharing for local servicegen domains in:
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-saas/app/auth/callback/route.ts`
- Added shared cookie domain resolution (`.servicegen.local`)

3. Added product e2e spec:
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-saas/tests/e2e/create-service-playground-flow.spec.ts`

## Validation commands
```bash
docker compose -f docker-compose.generated.yml exec -T service-gen-saas \
  sh -lc 'cd /app && pnpm -s typecheck'


docker compose -f docker-compose.generated.yml exec -T playwright-test \
  sh -lc 'cd /work && export PLAYWRIGHT_OUTPUT_DIR=/tmp/pw-output PLAYWRIGHT_ARTIFACT_DIR=/tmp/pw-artifacts && \
  pnpm exec playwright test tests/e2e/create-service-playground-flow.spec.ts --reporter=line --workers=1 --output=/tmp/pw-output'


docker compose -f docker-compose.generated.yml exec -T playwright-test \
  sh -lc 'cd /work && export PLAYWRIGHT_OUTPUT_DIR=/tmp/pw-output PLAYWRIGHT_ARTIFACT_DIR=/tmp/pw-artifacts && \
  pnpm exec playwright test tests/e2e/home-auth-redirects.spec.ts tests/e2e/create-service-playground-flow.spec.ts --reporter=line --workers=1 --output=/tmp/pw-output'
```

## Results
- Typecheck: pass
- `create-service-playground-flow.spec.ts`: `1 passed`
- Combined smoke (`home-auth-redirects` + new e2e): `3 passed`

## Artifacts updated
- Product test plan/report/traceability updated to include new browser e2e evidence.
