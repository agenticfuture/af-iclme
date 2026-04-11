# Privacy Current State v1.2.0

## Status
- A real privacy capability domain now exists.
- The first implemented cap is subject export inventory.
- The first live contract test for privacy export is now passing in the normal API container.

## Completed In This Slice
- Mounted the privacy domain in the focused API test app.
- Added authenticated body-scope enforcement for the privacy export route.
- Added a live contract test for `POST /api/privacy/v1/subjects/export`.
- Verified real inventory resolution across:
  - core DB subject lookup by email hash
  - chatbot DB subject lookup by email
- Verified cross-tenant body scope rejection.

## Main Files
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/privacy/caps/export_subject_data/api.py`
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/privacy/adapters/chatbot_subject_reader.py`
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/privacy/shared/entities.py`
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/analytics_test_app.py`
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/tests/test_privacy_export_contract.py`

## Executed Verification
- `tests/test_privacy_export_contract.py`
- Result: `2 passed`

## Deferred
- Real export payload assembly is still pending.
- delete/redact caps remain scaffolded for later slices.
- Browser E2E remains intentionally out of scope for this phase.
