# CHG-020 Architecture Notes

## Problem
The deploy task writes `Deployment.url`, but the active migration creating `service.deployments` does not include the `url` column. This causes SQLAlchemy insert failure during the wizard Finish step.

## Design
1. Add an additive migration (`0002_add_deployment_url`) to add nullable `service.deployments.url`.
2. Keep frontend wizard step 1/2 creation logic unchanged so service/chatbot IDs are still generated and reused.
3. Strengthen deploy logic to verify:
   - service exists for tenant
   - chatbot exists for same tenant and service
4. Return deployment URL in deploy response so frontend can display canonical bot URL.

## Data & Privacy
- Context isolation enforced by tenant/service/chatbot linkage checks.
- Existing ingestion path keeps tenant/service metadata for retrieval in vector store.

## Security
- Input validation prevents cross-service/cross-tenant deployment linkage.
- Transaction rollback on failure preserves DB integrity.
