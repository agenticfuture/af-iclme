# Privacy Domain Implementation Plan v1.1.0

## Goal
Move the privacy domain from backend-capability-ready to user-ready by adding:
- a SaaS privacy request UI
- a real user-facing request flow
- backend synchronization and request-status tracking
- real export payload assembly
- explicit core delete policy
- redact capability
- final non-browser and browser validation layers

## Current Baseline
- `POST /api/privacy/v1/subjects/export`
  - live
  - contract-tested
  - inventory only
- `POST /api/privacy/v1/subjects/delete`
  - live
  - contract-tested
  - chatbot deletion only
- `POST /api/privacy/v1/subjects/redact`
  - scaffold only
- no SaaS UI yet
- no user-facing request tracking yet

## What Is Missing For User Readiness
- no SaaS UI for privacy requests yet
- no user-facing request flow
- no real export payload assembly yet, only inventory
- core delete policy is still intentionally not implemented
- redact is not implemented yet
- no browser/user-path validation

## Product Shape

### SaaS Pages
- `GET /dashboard/privacy`
  - privacy request landing page
  - explanation of supported actions
  - list of prior requests
- `GET /dashboard/privacy/requests/[id]`
  - request detail/status page
  - progress, counts, result availability, audit summary

### User Actions
- start subject export
- start subject delete
- start subject redact
- review request status
- download export result when ready

### Operator Constraints
- tenant/org-scoped only
- role-gated to appropriate admins first
- destructive actions require explicit confirmation
- every request recorded with request id and execution status

## Backend Synchronization Model
Privacy actions need one orchestration layer, not direct SaaS-to-multiple-backend calls.

### Backend Ownership
- privacy domain orchestrates all work
- SaaS talks only to privacy endpoints
- privacy domain fans out into:
  - core DB
  - chatbot DB
  - related service/chat references

### Required Synchronization Guarantees
- one request id per privacy action
- one normalized status model for all sources
- explicit per-source execution sections:
  - core
  - chatbot
- partial-failure visibility
- resumable/readable status from SaaS

### Required Data Model
Add a privacy request audit table, likely under core DB:
- `privacy.requests`
  - `id`
  - `tenant_id`
  - `org_id`
  - `actor_id`
  - `action`
  - `subject_resolution`
  - `status`
  - `requested_at`
  - `started_at`
  - `completed_at`
  - `result_summary`
  - `error_summary`

Optional second table if needed later:
- `privacy.request_steps`
  - source-level progress rows for:
    - core
    - chatbot

## Capability Rollout

### Phase 1: Request Tracking And Backend Sync
Implement:
- `capabilities/privacy/caps/create_subject_request/`
- `capabilities/privacy/caps/get_subject_request_status/`

Deliverables:
- persistent privacy request audit row
- request id returned to SaaS immediately
- status API for request detail page
- synchronized result summary across core/chatbot work

### Phase 2: Real Export Payload Assembly
Upgrade:
- `capabilities/privacy/caps/export_subject_data/`

Deliverables:
- JSON export payload, not just inventory
- payload sections:
  - request metadata
  - subject resolution
  - core user metadata
  - core conversation/message records allowed by policy
  - chatbot chats/messages
  - related service ids
  - redaction/deletion markers
- persistent generated result reference

### Phase 3: Core Delete Policy
Upgrade:
- `capabilities/privacy/caps/delete_subject_data/`

Policy decision required:
- hard delete
- tombstone
- hybrid by entity type

Recommended first safe policy:
- chatbot:
  - hard delete chats/messages
- core:
  - tombstone subject-linked conversation content first
  - preserve auditability and foreign key stability

Deliverables:
- explicit entity-by-entity delete matrix
- live execution for approved core entities
- result summary returned and stored

### Phase 4: Redact Capability
Implement:
- `capabilities/privacy/caps/redact_subject_data/`

Deliverables:
- replace direct subject content with redacted placeholders
- preserve operational row shape when required
- produce redaction counts and status by source

### Phase 5: SaaS Privacy UI
Add:
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-saas/app/dashboard/privacy/page.tsx`
- `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/ui-apps/service-gen-saas/app/dashboard/privacy/requests/[id]/page.tsx`
- supporting dashboard components and proxy routes

Deliverables:
- request creation forms
- confirmation UX for delete/redact
- status list
- request detail page
- download action for export results

### Phase 6: Final Validation
Non-browser first:
- API contract tests
- security/privacy scope tests
- SaaS proxy tests
- UI component/integration tests

Then browser:
- admin creates export request
- admin reviews request detail
- admin downloads export
- admin creates delete/redact request
- admin sees final status

## API Shape
- `POST /api/privacy/v1/subjects/requests`
- `GET /api/privacy/v1/subjects/requests/{request_id}`
- `POST /api/privacy/v1/subjects/export`
- `POST /api/privacy/v1/subjects/delete`
- `POST /api/privacy/v1/subjects/redact`

Recommended evolution:
- request creation endpoint becomes the main user-facing entry
- direct action endpoints remain domain execution endpoints

## SaaS Integration Plan

### Proxy Layer
Add SaaS proxy routes for:
- create request
- get request status
- export result retrieval

### UI State
Support:
- action type
- subject selector
- request confirmation
- request polling or refresh
- result availability state

### Permissions
Use existing auth/session scope and restrict to:
- tenant admin
- org admin
- any stricter privacy-admin role if introduced later

## Testing Strategy

### Layer 1: Domain Logic
- subject resolution
- status transitions
- result assembly
- delete/redact policy mapping

### Layer 2: Adapter Integration
- core DB reads/writes
- chatbot DB reads/writes
- synchronized count summaries

### Layer 3: API Contracts
- create request
- request status
- export payload
- delete execution
- redact execution

### Layer 4: Security/Privacy
- tenant/org scope enforcement
- role enforcement
- no cross-tenant access
- no overexposed payload fields
- destructive confirmation/path rules

### Layer 5: SaaS Non-Browser Integration
- request form wiring
- status page wiring
- download link wiring
- error and partial-failure UX

### Layer 6: Browser Certification
- full user/admin path in built runtime

## Recommended Build Order
1. request tracking persistence + status API
2. real export payload assembly
3. SaaS privacy landing page and request detail page
4. core delete policy implementation
5. redact capability
6. browser/user-path certification

## Open Decisions To Lock Before Core Delete
- exact core entity delete matrix
- tombstone vs hard delete per entity
- export retention window
- whether result files live in object storage or DB-backed blob storage
- whether privacy requests need two-person approval for destructive actions
