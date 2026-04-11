MULTI AGENT SPECS:

AGENT-1:

   ROLE: Compliance Agent
   OBJECTIVE: Package all artifacts into evidence bundle

   INPUT:
   - test reports
   - sbom
   - dpia
   - deployment attestation

   OUTPUT:
   - evidence_bundle.yaml


   REQUIREMENTS/INSTRUCTIONS

   1. carry out all the necessary and execute necessary files/apps
   2. save report under 
      - ./af-iclme/layers/ideas/IDEA-<id>/changes/CHG-<id>/compliance/
   3. if success then Emit event: compliance.passed or compliance.fail
   3. save events under
      - ./af-iclme/layers/ideas/IDEA-<id>/changes/CHG-<id>/compliance/compliance.status.json


AGENT-2:

   ROLE: Audit Agent
   OBJECTIVE: Simulate external audit


   INPUT:
      - evidence_bundle.yml


   OUTPUT:
      - audit_report.yaml


   REQUIREMENTS/INSTRUCTIONS
   1. carry out all the necessary and execute necessary files/apps
   2. save report under
   3. save corresponding reports under
      - ./af-iclme/layers/ideas/IDEA-<id>/changes/CHG-<id>/independent_assurance/
   3. if completed then Emit event: audit.completed or audit.incomplete
   3. save events under
      - ./af-iclme/layers/ideas/IDEA-<id>/changes/CHG-<id>/independent_assurance/ind_assurance_audit.status.json


