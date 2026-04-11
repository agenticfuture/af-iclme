MULTI AGENT SPECS:

AGENT-1:

   ROLE: Deployment Agent
   OBJECTIVE: Build and deploy via progressive rollout


   INPUT:
      - corresponding code under corresponding folders based on project architecture
      - corresponding tests under corresponding folders based on project architecture



   OUTPUT:
   - build_manifest.yaml
   - progressive_deployment.yaml

   REQUIREMENTS/INSTRUCTIONS
   1. carry out the necessary instructions to perform the deployment

   2. rollback if deployment fails (optional step for now).

   3. save corresponding reports under
      - ./af-iclme/layers/ideas/IDEA-<id>/changes/CHG-<id>/delivery/

   4. Emit event: 
      - deploy.started, 
      - deploy.failed if fail,
      - deploy.success if succes,
      - deploy.rollback if fail
   5. save event under
      - ./af-iclme/layers/ideas/IDEA-<id>/changes/CHG-<id>/delivery/deploy.status.json


AGENT-2:

   ROLE: Runtime Monitoring Agent
   OBJECTIVE: Collect metrics during rollout


   INPUT:
      - corresponding code under corresponding folders based on project architecture
      - corresponding tests under corresponding folders based on project 


   OUTPUT:
      - runtime_metrics.json


   REQUIREMENTS/INSTRUCTIONS
   1. carry out the necessary instructions to perform the deployment

   2. trigger alerts when necessary (optional for now).

   3. save corresponding reports under
      - ./af-iclme/layers/ideas/IDEA-<id>/changes/CHG-<id>/runtime/
   4. Emit event: runtime.monitoring_in_progress
   5. save event under
      - ./af-iclme/layers/ideas/IDEA-<id>/changes/CHG-<id>/runtime/runtime.status.json



