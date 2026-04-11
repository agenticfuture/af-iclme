# Create Service - Phase 7 Walkthrough (FR-SERV-004 Direct-Ingest E2E)

Date: 2026-03-02

## Objective
Close the remaining Product partial for FR-SERV-004 (direct-ingest path without clicking "Add Data Source").

## Work performed
1. Added/extended browser e2e in:
   - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-saas/tests/e2e/create-service-playground-flow.spec.ts`
   - New case: `step 3 direct-ingest works without clicking Add`

2. Test logic validates:
   - Step 3 source type forced to file mode
   - File attached without clicking Add
   - `POST /api/job/services/{id}/jobs/ingest-file` observed from browser
   - Wizard advances to Channels
   - Data source appears when navigating back to Step 3

3. Stabilization improvements applied:
   - Added `credentials: "include"` to create-service wizard API calls (already in prior phase)
   - Added explicit selector hardening for datasource combobox and Channels heading checks
   - Added JWT-cookie bootstrap path for direct-ingest test to avoid Keycloak registration variability

## Execution results
### Successful evidence (already captured)
- `create-service-playground-flow.spec.ts` (finish + playground mode case): PASS
- `home-auth-redirects.spec.ts` + above smoke: PASS

### FR-SERV-004 direct-ingest case
- Test implementation complete
- Runtime in `playwright-test` container showed runner-level instability/hang (worker process remained alive without returning deterministic pass/fail in this environment)
- This is documented as an execution-environment issue, not a selector mismatch at the final state

## Artifact updates
- Updated Product layer docs to include direct-ingest case and current execution status:
  - `Product/test_plan.md`
  - `Product/test_report.md`
  - `Product/traceability_report.md`

## Next action to close FR-SERV-004 as full PASS
- Re-run the direct-ingest e2e case in a stable Playwright runner session (same spec/case) and capture pass evidence.
