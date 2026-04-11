# Tenant Registration Risk Test Cases
Version: 1.0
Derived From: Risk Spec v1.0

---

## TC-RISK-TEN-REG-001: Mitigation - Bot Abuse (Rate Limit)
**Risk ID**: RISK-TEN-REG-2026-001
**Steps**:
1. Disable CAPTCHA temporarily.
2. Script 50 registration attempts.
**Expected Result**:
- System blocks requests after the 5th attempt with 429 status.
- Verification emails are only sent for the first 5 requests.

---

## TC-RISK-TEN-REG-002: Mitigation - Token Entropy & Expiration
**Risk ID**: RISK-TEN-REG-2026-002
**Steps**:
1. Generate a registration link.
2. Modify the token by 1 character and attempt access.
3. Wait 49 hours and attempt access with the original valid link.
**Expected Result**:
- Modified token results in 404/403.
- Expired token results in "Link expired" error and account remains unverified.
