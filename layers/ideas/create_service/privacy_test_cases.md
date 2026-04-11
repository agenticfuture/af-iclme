# Privacy Test Cases: Create Service (`create_service`)

## 1. Overview
Validation of privacy controls during service creation and data ingestion.

## 2. Test Cases

### TC-PR-SERV-001: PII Redaction Verification
- **Objective**: Verify that PII is masked during knowledge base ingestion.
- **Steps**:
    1. Upload a document containing a dummy SIN/social security number and name.
    2. Trigger deployment (Finish Step 5).
    3. Inspect the vector store or the `redacted_data` logs.
- **Expected Results**: Sensitive numbers and names are replaced with tokens like `[REDACTED]`.

### TC-PR-SERV-002: Agent Credential Storage
- **Objective**: Ensure agent passwords are not stored in plain text.
- **Steps**:
    1. Create an agent in Step 5.
    2. Click Finish.
    3. Query the `human_agents` database table.
- **Expected Results**: The password column contains a secure hash or is null (if OIDC is used).

### TC-PR-SERV-003: Audit Log Traceability
- **Objective**: Verify that service creation is logged.
- **Steps**:
    1. Complete the wizard.
    2. Check the platform audit logs.
- **Expected Results**: Entry found with `action: CREATE_SERVICE`, `actor: [user_id]`, and `tenant_id: [tenant_id]`.

### TC-PR-SERV-004: Data Residency Enforcement (Logical)
- **Objective**: Verify that datasource IDs are tagged with the correct tenant/org.
- **Steps**:
    1. Inspect the ingestion job payload in Step 3.
- **Expected Results**: Metadata includes correct `tenant_id` and `org_id` to ensure isolation.
