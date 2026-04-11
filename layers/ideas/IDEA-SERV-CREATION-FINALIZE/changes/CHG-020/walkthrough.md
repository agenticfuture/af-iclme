# Walkthrough - Deployment Insert Failure Fix (CHG-020)

## Overview
Fixed the wizard Finish deployment crash caused by a schema/code mismatch in `service.deployments`.

## Root Cause
- Backend deploy logic inserts `Deployment.url`.
- Active migration `0001_create_tables` did not create a `url` column on `service.deployments`.
- Result: SQLAlchemy insert fails during deploy, frontend shows: "Deployment failed. Please try again."

## Changes Made
1. Added migration `capabilities/db/migrations/versions/0002_add_deployment_url.py` to add `service.deployments.url`.
2. Updated deploy response contract to include `url` (`DeployResponse.url`).
3. Updated deploy workflow to return the persisted URL.
4. Hardened deploy task validation:
   - service must belong to tenant
   - chatbot must belong to same tenant and service
   - rollback on exception
5. Preserved frontend service/bot creation sections and ID flow in wizard steps 1 and 2.

## Embeddings and Context Continuity
- Existing ingestion flow keeps tenant/service-aware metadata and collection naming in the knowledge-base/embedding path.
- Deployment fix keeps tenant/service/chatbot linkage strict so bot configuration can retrieve the right context.

## Verification
- Syntax checked changed backend files:
  - `PYTHONPYCACHEPREFIX=/tmp/pycache python3 -m py_compile ...` -> passed
- Confirmed wizard paths still present:
  - service creation endpoint call in Step 1
  - chatbot creation endpoint call in Step 2
  - deploy call in Finish

## Tracking Updates
- Copied prompt tracking file to:
  - `af-iclme/execution-plans/already_run/24_exe_plan_template_prompt.md`
- Saved this walkthrough under:
  - `af-iclme/layers/ideas/IDEA-SERV-CREATION-FINALIZE/changes/CHG-020/walkthrough.md`
