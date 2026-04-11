# Threat Model - Service Creation

## Threats
- **T1: Unauthorized Service Creation**: User attempts to create service for another tenant.
- **T2: API Injection**: Malicious input in service name/persona.
- **T3: Denial of Service**: Spamming creation endpoints.

## Controls
- **C1: Tenant Validation**: Backend hardcodes `tenant_id` from session (simulated for now, but enforced in schema).
- **C2: Input Sanitization**: Pydantic models for request validation.
- **C3: Rate Limiting**: (To be implemented in future cycles at API Gateway layer).
