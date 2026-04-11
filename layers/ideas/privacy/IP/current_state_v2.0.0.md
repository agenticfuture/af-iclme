# Privacy Current State v2.0.0

## Status
- `redact_subject_data` is now implemented as a first real privacy redaction slice.
- The SaaS privacy request form now exposes redact as a live partial action instead of a disabled placeholder.

## Implemented
- Direct redact endpoint:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/privacy/caps/redact_subject_data/api.py`
- Redact handler/workflow/functions:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/privacy/caps/redact_subject_data/handler.py`
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/privacy/caps/redact_subject_data/workflow.py`
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/privacy/caps/redact_subject_data/functions.py`
- Core redaction support:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/privacy/adapters/core_subject_reader.py`
- Chatbot redaction support:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/privacy/adapters/chatbot_subject_reader.py`
- Request-tracking integration for redact:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/privacy/caps/create_subject_request/functions.py`
- Privacy entities extended for redact request/response models:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/privacy/shared/entities.py`
- Privacy domain mounted with redact:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/privacy/factory.py`
- SaaS privacy form updated to expose redact:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-saas/components/dashboard/privacy-dashboard.tsx`

## Product Behavior
- Redact preserves records and removes sensitive content in the first slice.
- Core redaction:
  - replaces `conversation.messages.content_enc` with redacted content
  - replaces `conversation.threads.external_ref` with a redacted marker
- Chatbot redaction:
  - replaces `Message_v2.parts` with redacted text parts
  - clears `Message_v2.attachments`
  - replaces `Chat.title` with a redacted marker
- Tracked privacy requests now support:
  - `export`
  - `delete`
  - `redact`

## Verification
- Python syntax compilation passed for the new redact backend files and the new contract file.
- SaaS source sanity check confirmed redact is exposed and wired in the dashboard request form.
- Live end-to-end runtime proof for redact is still not fully closed in the stripped-down API container because that runtime is missing normal test dependencies.

## Current Product Boundary
- Export:
  - working with real payload and download support
- Delete:
  - still chatbot-delete only
- Redact:
  - working as content redaction in the first slice
  - not yet fully runtime-certified end to end through the live SaaS flow
- Browser E2E:
  - still intentionally deferred

## Main Planning Reference
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/af-iclme/layers/ideas/privacy/IP/implementation_plan_v1.1.0.md`
