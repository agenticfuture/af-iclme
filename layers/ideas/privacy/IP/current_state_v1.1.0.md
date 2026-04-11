# Privacy Current State v1.1.0

## Status
- A real privacy capability domain now exists.
- The first implemented cap is subject export inventory.

## Completed In This Slice
- Added chatbot subject resolution and inventory support to the privacy export path.
- Chatbot subjects can now be resolved by:
  - `chatbot_user_id`
  - `email`
- Chatbot export inventory now counts:
  - chats
  - messages
- Reused the existing chatbot DB connection pattern already used by analytics.

## Main Files
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/privacy/adapters/chatbot_subject_reader.py`
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/privacy/caps/export_subject_data/functions.py`
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/privacy/shared/entities.py`

## Current Domain Shape
- `POST /api/privacy/v1/subjects/export`
- delete/redact caps remain scaffolded for later slices

## Verification
- Python syntax compilation passed for the privacy domain files.

## Deferred
- Live API contract execution still needs to be added for the privacy export endpoint.
- Browser E2E remains intentionally out of scope for this phase.
