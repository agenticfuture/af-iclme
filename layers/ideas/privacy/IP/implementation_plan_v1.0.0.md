# Privacy Domain Implementation Plan v1.0.0

## Goal
Build a real privacy domain that owns subject data actions across core platform data and chatbot data.

## Scope For This Domain
- Export subject data
- Delete subject data
- Redact subject data
- Subject request status and audit trail

## Domain Boundary
This domain orchestrates privacy actions across:
- core DB
- chatbot DB
- service-scoped conversation data
- tenant/user identity resolution

It should not replace:
- tenant domain for scope and identity context
- service/chatbot domains for operational behavior

## Recommended Capability Structure
- `capabilities/privacy/factory.py`
- `capabilities/privacy/shared/entities.py`
- `capabilities/privacy/adapters/core_subject_reader.py`
- `capabilities/privacy/adapters/chatbot_subject_reader.py`
- `capabilities/privacy/caps/export_subject_data/`
- `capabilities/privacy/caps/delete_subject_data/`
- `capabilities/privacy/caps/redact_subject_data/`
- `capabilities/privacy/caps/get_subject_request_status/`

## Subject Resolution Strategy
Primary identifiers:
- `tenant_id`
- `org_id`
- one of:
  - `core_user_id`
  - `external_id`
  - `email`
  - `chatbot_user_id`

Core lookup rules:
- Resolve core user by `core_user_id`
- else by `external_id`
- else by HMAC email fingerprint

Chatbot lookup rules:
- Resolve chatbot user by `chatbot_user_id`
- else by email when available

## Phase 1
Implement the privacy domain scaffold and export capability contract.

Deliverables:
- shared request/response entities
- core/chatbot subject reader adapters
- export capability route contract
- dry-run export inventory response

## Phase 2
Implement real export assembly.

Expected export sections:
- subject identity metadata
- core conversations/messages
- chatbot chats/messages
- related service references
- redaction status markers

## Phase 3
Implement delete capability.

Delete policy:
- hard delete chatbot chats/messages for resolved subject
- delete or tombstone core subject conversation rows according to business policy
- preserve audit trail of request execution

## Phase 4
Implement redact capability.

Redaction policy:
- preserve operational record shape where required
- replace direct subject content with redacted placeholders
- preserve tenant/service scoped auditability

## Phase 5
Add request-status and audit support.

Track:
- request id
- tenant/org scope
- actor
- action type
- status
- started/completed timestamps
- affected row counts

## API Shape
- `POST /api/privacy/v1/subjects/export`
- `POST /api/privacy/v1/subjects/delete`
- `POST /api/privacy/v1/subjects/redact`
- `GET /api/privacy/v1/subjects/requests/{request_id}`

## Testing Strategy
Layer 1: entity and resolver logic
Layer 2: adapter integration for core/chatbot lookup
Layer 3: API contract tests
Layer 4: security/privacy scope tests
Layer 5: SaaS non-browser integration once UI exists

## Open Design Decisions
- final delete policy for core conversation records: hard delete vs tombstone
- export file format: JSON only first, CSV later if needed
- audit storage location: privacy domain table vs audit domain
