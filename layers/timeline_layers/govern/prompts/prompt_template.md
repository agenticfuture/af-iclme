ROLE: Governance Evaluation Agent
OBJECTIVE: Produce governance directive for change

INPUT:
- change_spec.yaml

OUTPUT:
- governance_directive.yaml

REQUIREMENTS:
1. Evaluate risk
2. Define approvals required
3. Define autonomy scope
4. Define mandatory compliance controls
5. Save under:
   - ./af-iclme/layers/ideas/IDEA-<id>/changes/governance_directive.yaml
   - ./af-iclme/layers/ideas/IDEA-<id>/changes/governance.assessed.json
6. Emit event: governance.assessed
