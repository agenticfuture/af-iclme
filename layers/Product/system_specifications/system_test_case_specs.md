# ServiceGen
# System Test Case Specification
Version: 1.0
Derived From: ServiceGen BRD v1.0
Prepared By: Business Analysis
Status: QA / Product / Engineering Validation Ready

---

# 1. Purpose

This document defines the full functional and non-functional system test cases
for ServiceGen based strictly on the approved BRD v1.0.

It validates:

- Tenant lifecycle
- Service lifecycle
- Chatbot functionality
- Data source lifecycle
- Channel management
- Billing & subscription engine
- Marketing & CRM workflows
- Deployment flows
- Multi-tenant behavior
- Performance & availability targets

Each test case includes:

- Test Case ID
- Requirement Traceability
- Preconditions
- Test Steps
- Expected Results
- Postconditions
- Negative & Edge Case Coverage

---

# 2. Traceability Matrix

| Prefix | Domain | BRD Section |
|--------|--------|-------------|
| TC-TEN | Tenant | 5.1 |
| TC-SRV | Service | 5.2 |
| TC-CHAT | Chatbot | 5.3 |
| TC-DS | Data Sources | 5.4 |
| TC-CH | Channels | 5.5 |
| TC-BILL | Billing | 5.6 |
| TC-MKT | Marketing | 5.7 |
| TC-NFR | Non-Functional | Section 6 |

---

# 3. Tenant Management Tests

---

## TC-TEN-001: Tenant Registration

Traceability: BR-TEN-001

Preconditions:
- User not registered.

Steps:
1. Submit registration form.
2. Provide organization name.
3. Provide admin credentials.

Expected Result:
- Tenant record created.
- Admin role assigned.
- Confirmation returned.

Postconditions:
- Tenant stored in system.

---

## TC-TEN-002: Duplicate Tenant Prevention

Steps:
1. Attempt registration using existing email.

Expected Result:
- Registration rejected.
- Clear error message displayed.

---

## TC-TEN-003: Authentication

Traceability: BR-TEN-002

Steps:
1. Submit valid credentials.

Expected Result:
- Authentication successful.
- Session token issued.

Negative:
- Invalid password → rejected.

---

## TC-TEN-004: Tenant Configuration Update

Traceability: BR-TEN-003

Steps:
1. Update organization name.
2. Update logo.
3. Save changes.

Expected Result:
- Changes persisted.
- Audit log recorded.

---

## TC-TEN-005: User Invitation

Traceability: BR-TEN-004

Steps:
1. Admin invites new user.
2. Assign role.

Expected Result:
- Invitation email sent.
- User assigned correct role.

---

# 4. Service Management Tests

---

## TC-SRV-001: Create Service

Traceability: BR-SRV-001

Steps:
1. Provide name and description.
2. Submit form.

Expected Result:
- Service created.
- Status = Draft.

---

## TC-SRV-002: Modify Service

Traceability: BR-SRV-002

Steps:
1. Edit metadata.
2. Update chatbot.
3. Save.

Expected Result:
- Changes persisted.

---

## TC-SRV-003: Archive Service

Traceability: BR-SRV-003

Steps:
1. Archive active service.

Expected Result:
- Status = Archived.
- Cannot process new messages.

Edge Case:
- Attempt to archive already archived service → no change.

---

# 5. Chatbot Tests

---

## TC-CHAT-001: Chatbot Configuration

Traceability: BR-CHAT-001

Steps:
1. Configure model type.
2. Set temperature.
3. Save.

Expected Result:
- Configuration stored.

---

## TC-CHAT-002: Automated Configuration Suggestion

Traceability: BR-CHAT-002

Steps:
1. Select service industry.
2. Upload data sources.
3. Request auto-suggestion.

Expected Result:
- Recommended chatbot configuration displayed.

---

## TC-CHAT-003: Request Handling

Traceability: BR-CHAT-003

Steps:
1. Send message via channel.
2. Await response.

Expected Result:
- Chatbot response returned.
- Response based on embeddings.

---

## TC-CHAT-004: Conversation Storage

Traceability: BR-CHAT-004

Steps:
1. Send conversation.
2. Retrieve stored messages.

Expected Result:
- Messages stored correctly.
- Metadata preserved.

---

# 6. Data Source Lifecycle Tests

---

## TC-DS-001: Add Data Source

Traceability: BR-DS-001

Steps:
1. Upload PDF.
2. Submit.

Expected Result:
- Data source stored.
- Embeddings generated.

---

## TC-DS-002: Validate Data Source

Traceability: BR-DS-002

Steps:
1. Upload corrupted file.

Expected Result:
- Validation fails.
- Error message returned.

---

## TC-DS-003: Delete Data Source

Traceability: BR-DS-003

Steps:
1. Delete source.

Expected Result:
- Source removed.
- Associated embeddings deleted.

---

# 7. Channel Management Tests

---

## TC-CH-001: Add Channel

Traceability: BR-CH-001

Steps:
1. Configure Slack channel.
2. Save.

Expected Result:
- Channel connected.
- Validation successful.

---

## TC-CH-002: Deploy Bot

Traceability: BR-CH-002

Steps:
1. Deploy bot to channel.

Expected Result:
- Bot active.
- Messages routed correctly.

---

## TC-CH-003: Unpublish Bot

Steps:
1. Unpublish bot.

Expected Result:
- Bot removed.
- No new messages processed.

---

# 8. Billing & Subscription Tests

---

## TC-BILL-001: Subscribe to Plan

Traceability: BR-BILL-001

Steps:
1. Select plan.
2. Enter payment info.

Expected Result:
- Subscription activated.

---

## TC-BILL-002: Upgrade Plan

Traceability: BR-BILL-002

Steps:
1. Upgrade from Free to Business.

Expected Result:
- Plan updated.
- Feature access changed accordingly.

---

## TC-BILL-003: Usage Tracking

Traceability: BR-BILL-004

Steps:
1. Exceed plan usage threshold.

Expected Result:
- Overage tracked.
- Billing event generated.

---

# 9. Marketing & CRM Tests

---

## TC-MKT-001: Campaign Creation

Traceability: BR-MKT-001

Steps:
1. Create campaign.
2. Schedule.

Expected Result:
- Campaign stored.
- Scheduled correctly.

---

## TC-MKT-002: Lead Capture

Traceability: BR-MKT-002

Steps:
1. Submit lead form.

Expected Result:
- Lead stored in CRM.

---

## TC-MKT-003: Referral Code Application

Traceability: BR-MKT-004

Steps:
1. Apply referral code.

Expected Result:
- Discount applied.
- Referral tracked.

---

# 10. Multi-Tenant Validation

---

## TC-TEN-MT-001: Tenant Isolation Functional Test

Steps:
1. Tenant A creates service.
2. Tenant B logs in.

Expected Result:
- Tenant B cannot view Tenant A service.

---

# 11. Deployment & Publish Flow

---

## TC-DEP-001: Publish Service

Steps:
1. Publish draft service.

Expected Result:
- Status = Active.
- Service available for traffic.

---

# 12. Non-Functional Requirement Tests

---

## TC-NFR-001: Chat Performance

Traceability: NFR-02

Steps:
1. Simulate high traffic.

Expected Result:
- p95 latency < 3 seconds.

---

## TC-NFR-002: Availability Validation

Traceability: NFR-03

Steps:
1. Monitor uptime over test window.

Expected Result:
- Uptime >= 99.5%.

---

## TC-NFR-003: Multi-Tenancy Isolation Load Test

Steps:
1. Simulate concurrent traffic from multiple tenants.

Expected Result:
- No data leakage.
- Stable performance.

---

# 13. Edge Cases

- Empty chatbot prompt
- Unsupported file type
- Subscription downgrade during active billing cycle
- Channel credential invalidation
- Deleting service with active channel
- Large file upload limit exceeded
- Long conversation history handling

---

# 14. Regression Suite Requirement

All above tests must be included in automated regression suite.

---

# 15. Approval

Approved by:

- Product Owner
- QA Lead
- Engineering Lead
- Governance Lead

---

End of System Test Case Specification