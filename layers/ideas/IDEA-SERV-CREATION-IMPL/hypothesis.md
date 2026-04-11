# Hypothesis - Service Creation Flow

## Problem Statement
The current service creation wizard in the frontend is not persistent. Closing the browser or a network failure results in data loss. Additionally, the backend lacks a structured capability for atomic service/chatbot creation.

## Proposed Solution
Implement a multi-step persistence logic:
1.  **Step 1**: Create a `DRAFT` Service in the DB.
2.  **Next Steps**: Progressively update/link components.
3.  **Finish**: Trigger full deployment and activation.

## Expected Outcome
- Users can resume drafts (future enhancement).
- Data integrity across the wizard steps.
- Clear separation between draft state and active service.
