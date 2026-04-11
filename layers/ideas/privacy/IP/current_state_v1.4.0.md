# Privacy Current State v1.4.0

## Status
- The privacy domain is backend-capability-ready for the first two actions:
  - subject export inventory
  - chatbot-scoped subject delete
- These caps are live and contract-tested in the normal API container.
- The privacy domain is not yet user-ready.

## Confirmed Working
- `POST /api/privacy/v1/subjects/export`
  - resolves subject across core DB and chatbot DB
  - returns inventory counts
  - enforces tenant/org body scope against authenticated scope
- `POST /api/privacy/v1/subjects/delete`
  - deletes scoped chatbot chats/messages for the resolved subject
  - enforces tenant/org body scope against authenticated scope

## Executed Verification
- `tests/test_privacy_export_contract.py`
- Result: `2 passed`
- `tests/test_privacy_delete_contract.py`
- Result: `2 passed`

## Why This Is Not User-Ready Yet
- no SaaS UI for privacy requests yet
- no user-facing request flow
- no real export payload assembly yet, only inventory
- core delete policy is still intentionally not implemented
- redact is not implemented yet
- no browser/user-path validation

## Required Backend Synchronization Work
- add a privacy request tracking model
- add request status endpoints
- normalize execution status across:
  - core
  - chatbot
- store request summaries and result metadata

## Recommended Next Build Sequence
1. implement privacy request tracking and request-status API
2. implement real export payload assembly
3. add SaaS privacy landing and request detail pages
4. finalize and implement core delete policy
5. implement redact capability
6. finish browser/user-path validation in built runtime

## Main Planning Reference
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/af-iclme/layers/ideas/privacy/IP/implementation_plan_v1.1.0.md`
