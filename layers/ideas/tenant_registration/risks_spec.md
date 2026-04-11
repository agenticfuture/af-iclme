# Tenant Registration Risk Specification
Version: 1.0
Derived From: Enterprise Risk Register Template v0.8.0
Status: Draft

---

## RISK-TEN-REG-2026-001: Automated Registration Bot Abuse
**Category**: OPS / SEC
**Description**: Malicious actors use bots to create thousands of fake tenant accounts, leading to database bloat, resource exhaustion (MinIO/Qdrant), and potential cost spikes in email services.
**Inherent Risk**:
- Severity: 4 (Major)
- Likelihood: 4 (Likely)
- Inherent Score: 16 (Critical)
**Controls**:
- CAPTCHA enforcement on registration form.
- IP-based rate limiting (5 attempts/hour).
- Mandatory email verification before resource allocation (MinIO namespaces).
**Residual Risk**:
- Severity: 2 (Minor)
- Likelihood: 2 (Unlikely)
- Residual Score: 4 (Low)

---

## RISK-TEN-REG-2026-002: Email Spoofing / Unauthorized Activation
**Category**: SEC / PRIV
**Description**: Attackers intercept or guess verification links to activate accounts they do not own, potentially gaining access to the initial admin session.
**Inherent Risk**:
- Severity: 5 (Critical)
- Likelihood: 2 (Unlikely)
- Inherent Score: 10 (Moderate)
**Controls**:
- High-entropy UUIDs for verification tokens.
- Short expiration window (48 hours).
- Token is single-use and tied to the specific user session/context.
**Residual Risk**:
- Severity: 4 (Major)
- Likelihood: 1 (Rare)
- Residual Score: 4 (Low)
