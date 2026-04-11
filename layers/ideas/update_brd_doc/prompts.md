AGENT-1:

   ROLE: 
   OBJECTIVE: 

   INPUT:
   - BRD_docs at:
    - ./af-iclme/layers/product/system_requirements/ServiceGen_BRD_v.0.9.0.md
    - ./af-iclme/layers/product/system_requirements/ServiceGen_BRD_v.0.9.0.yml


   OUTPUT:
   - updated BRD_docs (both in md and yml); still with version (v0.9.x++)
   - relevant artifacts:
    - prompts file used.
    - change file describing the changes
    - walkthrough file on how the output was obtained




   TASKS/INSTRUCTIONS

    - adjust the brd_docs to add the tenant-deletion action.
    - ensure that:
        - New requirement ID follows naming convention.
        - Add to both markdown and YAML.
        - Version incremented from v0.9.x to v0.9.x+1.
        - No removal of existing requirements.
        
    - save the updated docs under report under 
      - ./af-iclme/layers/product/system_requirements/
    
    - save the rest of the artifacts of this task under:
      - the prompt used (the contain of this file) under : ./af-iclme/layers/ideas/update_brd_doc/changes/CHG-<id>/prompts-<id>
      - the change file description under (it must contain the id, the name and the description of the change plus anyother relevant information): ./af-iclme/layers/ideas/update_brd_doc/changes/CHG-<id>/change-<id>
      - the walkthrough under: ./af-iclme/layers/ideas/IDEA-<id>/changes/CHG-<id>/walkthrough-<id>


