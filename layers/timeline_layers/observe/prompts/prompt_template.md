MULTI AGENT SPECS:

AGENT-1:

   ROLE: Observability Agent
   OBJECTIVE: Analyze metrics vs success criteria
   

   INPUT:
      - corresponding code under corresponding folders based on project architecture
      - corresponding tests under corresponding folders based on project architecture
      - corresponding monitoring software and logs produced


   OUTPUT:
   - continuous observability events


   REQUIREMENTS/INSTRUCTIONS

   1. IF metrics fail → emit rollback event
      IF metrics pass → emit performance.ok

   2. save events under
      - ./af-iclme/layers/ideas/IDEA-<id>/changes/CHG-<id>/runtime/observability.status.json


AGENT-2:

   ROLE: Insight Agent
   OBJECTIVE: Generate improvement suggestions


   INPUT:
      - corresponding code under corresponding folders based on project architecture
      - corresponding tests under corresponding folders based on project 
      - corresponding monitoring software and logs produced


   OUTPUT:
      - improvement_suggestion.yaml


   REQUIREMENTS/INSTRUCTIONS
   1. analyse monitored logs and content produced
   2. make suggestions 
   3. IF suggestion valid → create new idea
   4. save corresponding reports under
      - ./af-iclme/layers/ideas/IDEA-<id>/changes/CHG-<id>/evolve/
   4. Emit event: suggested.generated
   5. save event under
      - ./af-iclme/layers/ideas/IDEA-<id>/changes/CHG-<id>/evolve/suggestion.generated.json



