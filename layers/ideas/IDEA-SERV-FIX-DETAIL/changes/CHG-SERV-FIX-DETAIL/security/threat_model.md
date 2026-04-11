meta:
  artifact_type: threat_model
  layer: L5

threats:
  - name: unauthorized_bot_access
    impact: high
    mitigation: RBAC on service dashboard
  - name: qdrant_leakage
    impact: critical
    mitigation: strict filter by service_id in all search queries

security_controls:
  - encryption_at_rest
  - secure_token_handling
