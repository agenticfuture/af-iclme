# Security Test Cases: Create Service (`create_service`)

## 1. Overview
Validation of security controls during service creation, ingestion, and testing.

## 2. Test Cases

### TC-SEC-SERV-001: Cross-Tenant Ingestion Attempt
- **Objective**: Verify that a user cannot ingest data into another tenant's service.
- **Steps**:
    1. Authenticate as User A (Tenant 1).
    2. Attempt a POST to `/api/job/services/[Tenant2_ServiceID]/jobs/ingest-file`.
- **Expected Results**: 403 Forbidden or 404 Not Found.

### TC-SEC-SERV-002: SSRF via URL Ingestion
- **Objective**: Verify RISK-SEC-2026-LOGO-003 is mitigated.
- **Steps**:
    1. Fill Step 3 with URL: `http://localhost:8000/admin` or `http://169.254.169.254/latest/meta-data/`.
    2. Trigger ingestion.
- **Expected Results**: Ingestion job fails with "Invalid or restricted URL".

### TC-SEC-SERV-003: Playground Sandbox Verification
- **Objective**: Verify iframe isolation.
- **Steps**:
    1. Open the Playground.
    2. Attempt to access `window.parent.localStorage` from the bot console (if accessible for testing).
- **Expected Results**: Access is blocked by browser-level cross-origin/sandbox policies.

### TC-SEC-SERV-004: Agent RBAC Leakage
- **Objective**: Verify that an agent cannot see services they aren't assigned to.
- **Steps**:
    1. Login as Agent X assigned to Service 1.
    2. Attempt to GET `/api/service/v1/services/[Service2_ID]`.
- **Expected Results**: 403 Forbidden.

### TC-SEC-SERV-005: Malicious File Ingestion
- **Objective**: Verify malware protection.
- **Steps**:
    1. Upload an EICAR test file in Step 3.
- **Expected Results**: Upload is rejected or ingestion job is marked as "FAILED - MALWARE DETECTED".
