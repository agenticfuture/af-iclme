# Privacy Current State v1.3.0

## Status
- The privacy domain now has two live, non-browser caps:
  - subject export inventory
  - subject delete
- Both caps are passing contract tests in the normal API container.

## Completed In This Slice
- Added a live contract test for `POST /api/privacy/v1/subjects/delete`.
- Verified tenant/org-scoped chatbot subject deletion by email.
- Verified cross-tenant body scope rejection on the delete route.
- Kept core deletion conservative for this phase:
  - `delete_core=false` remains the safe default
  - no core destructive policy has been applied yet

## Main Files
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/privacy/caps/delete_subject_data/api.py`
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/privacy/caps/delete_subject_data/functions.py`
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/privacy/adapters/chatbot_subject_reader.py`
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/tests/test_privacy_delete_contract.py`

## Executed Verification
- `tests/test_privacy_export_contract.py`
- Result: `2 passed`
- `tests/test_privacy_delete_contract.py`
- Result: `2 passed`

## Current Capability Boundary
- Export:
  - live inventory across core DB and chatbot DB
- Delete:
  - live chatbot chat/message deletion for resolved subject
  - conservative no-op for core data until final policy is approved
- Redact:
  - still scaffolded only

## Deferred
- Real export payload assembly is still pending.
- Core delete policy remains intentionally deferred.
- Redact capability remains intentionally deferred.
- Browser E2E remains intentionally out of scope for this phase.
