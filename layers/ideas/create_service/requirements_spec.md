# Requirements Specification: Create Service (`create_service`)

## 1. Introduction
This document specifies the requirements for the Service Creation Wizard in ServiceGen. The wizard allows tenant administrators to configure AI-powered services by defining bot personas, connecting knowledge bases (Source of Truth), and assigning human agents.

## 2. Functional Requirements

### FR-SERV-001: Multi-Step Wizard Navigation
The system shall provide a 5-step wizard to create a service:
1. **Service Details**: Name, Department, Description.
2. **Bot Configuration**: Bot Name, Persona (System Prompt).
3. **Data Sources**: Knowledge base ingestion (File, URL, S3).
4. **Channels**: Communication platform configuration (Slack, Teams, Web, Email).
5. **Agent Assignment**: Human agent oversight.

### FR-SERV-002: AI Suggestion Engine
The system shall provide a "Suggest" feature on Step 2 that generates a `botName`, `description`, and `prompt` based on the `serviceName` and `department` provided in Step 1.

### FR-SERV-003: Auto-Save Drafts
The system shall automatically create or update a service/chatbot draft in the backend when the user clicks "Next" in Steps 1 and 2.
- **Rules**: 
    - Step 1 creates the `Service` entity.
    - Step 2 creates the `Chatbot` entity linked to the `Service`.

### FR-SERV-004: Data Ingestion (Source of Truth)
The system shall allow users to upload files (.pdf, .docx, .txt, .md) or provide URLs for knowledge ingestion.
- **Direct Ingest**: If a user enters values in Step 3 but proceeds without clicking "Add", the system must process these inputs during the final deployment.

### FR-SERV-005: Deployment and Playground
Upon clicking "Finish" on Step 5, the system shall:
1. Execute all queued knowledge ingestion jobs.
2. Deploy the chatbot runtime.
3. Redirect the user to the **Playground** for testing.

### FR-SERV-006: Testing Playground
The system shall provide a playground where the bot can be tested via:
- **Iframe Mode**: Embedded via iframe from `bot.servicegen.local`.
- **Script Mode**: Loaded as a JS floating widget.

## 3. Non-Functional Requirements

### NFR-SERV-001: Performance (Ingestion)
Knowledge base ingestion jobs must be enqueued and processed asynchronously to avoid blocking the UI.

### NFR-SERV-002: Scalability
The deployment logic must support multiple active deployments per service context (though the wizard currently targets the latest draft).

### NFR-SERV-003: Reliability
The wizard must preserve `sg_service_id` and `sg_chatbot_id` in session storage to allow recovery from accidental page refreshes.
