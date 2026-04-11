# Risk Specification: Create Service (`create_service`)

## 1. Overview
This document assesses risks specific to the service creation and knowledge ingestion lifecycle.

## 2. Identified Risks

### RISK-SEC-2026-SERV-001: Prompt Injection via Persona Config
- **Description**: An admin attacker configures a bot with a malicious system prompt that ignores constraints or exfiltrates user data.
- **Impact**: AI safety violation, data leakage.
- **Inherent Risk**: High (16)
- **Mitigation**: 
    - LLM-based prompt validation during Step 2.
    - Mandatory prefixing of system instructions with platform-level guardrails.
- **Residual Risk**: Low (4)

### RISK-SEC-2026-SERV-002: Ingestion Data Poisoning
- **Description**: Malicious or incorrect documents are uploaded to the knowledge base, biasing the bot's outputs (hallucinations).
- **Impact**: Reputational damage, incorrect AI guidance.
- **Inherent Risk**: High (15)
- **Mitigation**:
    - "Source of Truth" verification (checksums, manual approval step if enabled).
    - Source transparency in the playground (showing citations).
- **Residual Risk**: Moderate (6)

### RISK-PRIV-2026-SERV-003: Over-Retention of Drafts
- **Description**: Abandoned service drafts containing PII remain in the database indefinitely.
- **Impact**: Privacy non-compliance (PIPEDA principle 5).
- **Inherent Risk**: Low (6)
- **Mitigation**:
    - Automated cleanup of DRAFT services older than 30 days.
- **Residual Risk**: Minimal (1)

### RISK-SEC-2026-SERV-004: SSRF through URL ingestion
- **Description**: The ingestion worker is tricked into making requests to internal infrastructure.
- **Impact**: Internal network scanning, metadata exfiltration.
- **Inherent Risk**: Critical (20)
- **Mitigation**:
    - Network-level isolation for ingestion workers (no internal VPC access).
    - URL blocklisting for private IP ranges.
- **Residual Risk**: Low (2)

## 3. Monitoring
High-frequency ingestion failures (e.g., >10 in 1 minute) will trigger a "Potential Ingestion Abuse" alert in the SOC dashboard.
