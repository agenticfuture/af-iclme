# Security Specification: Create Service (`create_service`)

## 1. Security Model
The service creation flow adheres to the **Zero Trust Architecture** and **Least Privilege** principles.

## 2. Technical Specifications

### SEC-SERV-001: Creation Endpoint Authorization
- POST requests to `/api/service/services` must require a valid JWT with `tenant_admin` or `admin` roles.
- All actions must be scoped to the `tenant_id` extracted from the JWT.

### SEC-SERV-002: Ingestion Security
- **Malware Scanning**: All uploaded files MUST be scanned for malware before processing.
- **Payload Limits**: File uploads must be limited to 50MB per request.
- **URI Validation**: Ingested URLs must be validated against a blocklist (e.g., localhost, private IPs) to prevent SSRF.

### SEC-SERV-003: Playground Isolation
- The Playground iframe must use the `sandbox` attribute with minimal permissions (`allow-scripts`, `allow-same-origin`, `allow-forms`).
- Cross-origin communication between the parent dashboard and the bot iframe must be restricted via `Content-Security-Policy`.

### SEC-SERV-004: Agent Access Control
- Human agents assigned in Step 5 must only have access to the specific `service_id` they are assigned to.
- RBAC must be enforced at the API gateway level for all agent interactions.

### SEC-SERV-005: Prompt Protection
- System prompts must be sanitized to prevent early-stage prompt injection that could reveal internal system instructions during the testing phase.
