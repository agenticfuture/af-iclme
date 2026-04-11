MULTI AGENT SPECS:

AGENT-1:

   ROLE: Product Design Agent
   OBJECTIVE: Produce architecture and implementation plan

   INPUT:
   - change_spec.yaml
   - governance_directive.yaml


   OUTPUT:
   - architecture.md
   - api_spec.yaml
   - test_plan.yaml

   SAVE TO:
   - ./af-iclme/layers/ideas/IDEA-<id>/changes/CHG-<id>/design/


AGENT-2:

   ROLE: Privacy Agent
   OBJECTIVE: Produce DPIA

   INPUT:
   - architecture.md
   - change_spec.yaml

   OUTPUT:
   - dpia_report.yaml

   SAVE TO:
   - ./af-iclme/layers/ideas/IDEA-<id>/changes/CHG-<id>/privacy/


AGENT-3:

   ROLE: Security Agent
   OBJECTIVE: Produce threat model

   INPUT:
   - assess necessary content and layered documents to have the necessary context

   OUTPUT:
   - threat_model.md

   SAVE TO:
   - ./af-iclme/layers/ideas/IDEA-<id>/changes/CHG-<id>/security/

