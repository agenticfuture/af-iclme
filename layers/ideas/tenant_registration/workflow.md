# Tenant Registration Workflow
Version: 1.0
Domain: Tenant Management
Alignment: Requirements Spec v1.0, Security Spec v1.0, Privacy Spec v1.0

---

## 1. Workflow Diagram (Logic)

```mermaid
graph TD
    Start((Start)) --> UserInput[User enters Registration Details]
    UserInput --> Captcha[CAPTCHA & Rate Limit Check]
    Captcha -- Passed --> Sanitization[Input Sanitization & Validation]
    Captcha -- Failed --> Blocked([Block Request 429])
    
    Sanitization --> DuplicateCheck{Duplicate Email?}
    DuplicateCheck -- Yes --> Error[Return Error: Email Registered]
    DuplicateCheck -- No --> Persist[Create Tenant & User Records]
    
    Persist --> Hash[Hash Password Argon2]
    Hash --> Draft[Set Status: Pending Verification]
    Draft --> Consent[Log Primary Consent in Ledger]
    
    Consent --> Email[Send Verification Email with UUID Token]
    Email --> Wait((Wait for User Action))
    
    Wait --> Click[User Clicks Link within 48h]
    Click --> TokenCheck{Token Valid & Not Expired?}
    
    TokenCheck -- No --> Expired[Redirect to 'Link Expired' Page]
    Expired --> Purge[Retention Engine Purges Record after 48h]
    
    TokenCheck -- Yes --> Activate[Update Status: Active]
    Activate --> Redirect[Redirect to Dashboard Login]
    Redirect --> MFA[Enforce MFA Setup on First Login]
    MFA --> Finish((Finish))
```

---

## 2. Step-by-Step Breakdown

### Step 1: Frontend Submission
- **Action**: User provides `Organization Name`, `Admin Email`, `Password`.
- **Constraint**: Must explicitly check "I agree to Terms & Privacy Policy" (PRV-TEN-REG-001).
- **Security**: Form protected by CAPTCHA (SEC-TEN-REG-002).

### Step 2: Ingestion & Validation
- **Action**: Backend receives POST request.
- **Security**: Check IP rate limit (SEC-TEN-REG-002).
- **Validation**:
    - Sanitize inputs to prevent SQLi (SEC-TEN-REG-003).
    - Validate password complexity (NFR-TEN-REG-002).
    - Check if email exists in `users` table.

### Step 3: Atomic Persistence
- **Action**: Start database transaction.
    - Generate unique `tenant_id` (UUID).
    - Create `tenants` record (REQ-TEN-REG-001).
    - Generate unique `user_id` (UUID).
    - Hash password using Argon2.
    - Create `users` record with `role='Admin'` linked to `tenant_id` (REQ-TEN-REG-002).
- **Privacy**: Log consent in `consent_ledger`.

### Step 4: Verification Trigger
- **Action**: Generate high-entropy token (RISK-TEN-REG-2026-002).
- **Action**: Send email via SMTP/SES.
- **State**: Tenant status set to `Pending Verification`.

### Step 5: Activation Lifecycle
- **Trigger**: Incoming GET request on `/verify?token=...`.
- **Validation**: Check token against expiry and usage.
- **Action**: Update `tenants.status` to `Active`.
- **Redirect**: Forward user to `/dashboard` with a flag to enforce MFA onboarding.

---

## 3. Failure Modes
- **Duplicate Registry**: Redirect back to login with prompt.
- **Timeout**: Retention engine (PRV-TEN-REG-003) purges draft records after 48h.
- **Bot Attack**: Rate limit blocks IP at the gateway.
