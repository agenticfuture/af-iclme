# Tenant Registration - Privacy Layer Test Report
Version: 1.0.0
Layer: Privacy (L4)
Idea: tenant_registration
Status: PASS (current implemented privacy scope)

## 1. Summary
Privacy-layer validation passed for the currently implemented tenant registration privacy controls.

Executed privacy suite result:
- `4 passed`

## 2. What Was Validated
### 2.1 Consent Management (PRV-TEN-REG-001)
- Successful registration persists a `tenant_reg.consent_ledger` row
- Consent row contains:
  - `consent_type = service`
  - `granted = true`
  - `granted_at` timestamp
  - `purpose = tenant_registration`
  - version evidence (`terms:v1`, `privacy:v1`)

### 2.2 Data Minimization (PRV-TEN-REG-002)
- Registration API contract (`RegisterTenantRequest`) only includes required fields for current architecture:
  - organization name
  - admin email
  - captcha token
  - consent
  - optional client context / correlation / idempotency metadata
- No `home_address`, `phone`, or `email_plaintext` fields in `tenant_reg.registration_requests`
- Password is not collected by tenant registration API because Keycloak is the credential owner

### 2.3 Tenant Isolation at Registration (PRV-TEN-REG-003)
- Two independent registrations create distinct:
  - `tenant_id`
  - `org_id`
  - `core_user_id`
- Confirms unique assignment and correct linkage at registration/projection creation time

### 2.4 Deletion / Retention (48h timeout purge)
- Unverified registration can be expired and purged via tenant internal purge endpoint
- Registration row is marked:
  - `status = expired`
  - `current_state = EmailVerificationTimeout`
- Draft projections are deleted:
  - `core.tenants`
  - `core.organizations`
  - `core.users`
  - `private.user_pii`

## 3. Notes
1. PII encryption-at-rest is also validated in the Security layer report and remains a privacy-relevant supporting control.
2. Privacy test scope here is focused on registration-time privacy guarantees and purge semantics in the current tenant implementation.
