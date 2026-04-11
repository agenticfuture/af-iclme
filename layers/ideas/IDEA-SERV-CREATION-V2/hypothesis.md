# Hypothesis

If we correctly load all database models in the API entry point and integrate the frontend wizard with atomic backend endpoints for service and chatbot creation, we will resolve the 500 Internal Server Errors and provide a seamless, persistent service creation experience.

## Metrics
- Wizard Step 1 creates Service (status: draft) in DB.
- Wizard Step 2 creates Chatbot (linked to service) in DB.
- Wizard Finish triggers Deployment and Redirect.
- Zero `NoReferencedTableError` in API logs.
