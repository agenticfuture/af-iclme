# Privacy Specification: Create Service (`create_service`)

## 1. Data Handling during Ingestion
The service creation process involves ingestion of organizational knowledge which may contain PII.

### PR-SERV-001: PII Redaction
- All ingested data (files, URLs) must pass through a redaction layer before being stored as embeddings.
- **Traceability**: PIPEDA Principle: Safeguards.

### PR-SERV-002: Sensitive Config Masking
- System prompts in Step 2 must be stored securely and not exposed to lower-privileged users.
- Agent credentials (generated in Step 5) must be handled securely (hashed if stored, or ephemeral if managed via OIDC).

### PR-SERV-003: Audit Logging
The following events must match the platform's audit log requirements:
- Service Creation (Timestamp, User, Tenant)
- Bot Configuration Change
- Knowledge Base Source Addition
- Deployment Trigger

## 2. Agent Management
- Human agent profiles (Name, Email) are considered PII and must follow the Platform Privacy Spec for retention (24 months for logs).

## 3. Data Residency
- All knowledge base contents and vector embeddings must be stored in the tenant's designated region (**Canada** for Canadian tenants).
