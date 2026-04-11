# Requirements Test Cases: Create Service (`create_service`)

## 1. Overview
These test cases validate the functional flow of the service creation wizard and the subsequent deployment.

## 2. Test Cases

### TC-SERV-FUN-001: Wizard Step 1 & 2 Auto-Save
- **Objective**: Verify that draft entities are created in the database.
- **Steps**:
    1. Enter "HR Benefits" in Step 1. Click "Next".
    2. Check `sessionStorage` for `sg_service_id`.
    3. Enter "BenefitsBot" in Step 2. Click "Next".
    4. Check `sessionStorage` for `sg_chatbot_id`.
- **Expected Results**: Service and Chatbot IDs are present and valid.

### TC-SERV-FUN-002: AI Suggestion Inflow
- **Objective**: Verify the "Suggest" feature fills the form correctly.
- **Steps**:
    1. Fill Step 1 (Service: "IT Support", Dept: "IT").
    2. Go to Step 2. Click "Suggest".
- **Expected Results**: `botName`, `description`, and `prompt` are populated with relevant IT Support content.

### TC-SERV-FUN-003: Multi-File Ingestion (Step 3)
- **Objective**: Verify multiple files can be enqueued.
- **Steps**:
    1. Upload `policy1.pdf` and `manual.docx`.
    2. Click "Next" (Direct Ingest).
- **Expected Results**: Backend receives separate ingestion job enqueues for both files.

### TC-SERV-FUN-004: Deployment and Playground Redirect
- **Objective**: Verify the transition from configuration to testing.
- **Steps**:
    1. Complete all 5 steps.
    2. Click "Finish".
- **Expected Results**: 
    - Progress dialog shows "Deploying...".
    - Redirected to `/dashboard/services/[service_id]/playground`.
    - Iframe in playground successfully loads the chatbot UI.

### TC-SERV-FUN-005: Playground Mode Toggle
- **Objective**: Verify Iframe vs Script mode in Playground.
- **Steps**:
    1. Toggle between "Iframe Mode" and "JS Script Mode" tabs.
- **Expected Results**: Chatbot UI renders correctly in both modes.
