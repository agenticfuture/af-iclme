AGENT-1:

   ROLE: 
   OBJECTIVE: 

   INPUT:
    - IDEA-NAME=tenant_registration
    - DOMAIN= tenant
    - implementation_plan for the cap    

    



   OUTPUT:

    - expected implemented code based on project structure and provided files
    - expected implemented tests aligning with provided docs and project structures
    - a tracability matrix mapping code to req and tests implemented.

   section 2: additional relevant artifacts:
    - prompts file used.
    - change file describing the changes
    - walkthrough file on how the output was obtained




   TASKS/INSTRUCTIONS

    - now based on the implementation plan you produce, go adhead and carry out its execution
    knowing that everything runs inside docker and you will need to write docker cmds for certain execution
    and testing.
    - follow everything, nothing must be missing. All the tests must be confirmed and sured to pass
    - all the e2e tests must be working normally nothing missing (evenif you need to install playwright for that:
    just ask)
    - after implementing everything a new user must have to be able to carry that function fully and well nothing
    missing.
    

   
        

    
    - save all the docs of section 2  under: (ignore for now as you are only answering in the chat)
      - the prompt used (the contain of this file) under : ./af-iclme/layers/ideas/{IDEA-NAME}/changes/CHG-<id>/prompts-<id>
      - the change file description under (it must contain the id, the name and the description of the change plus anyother relevant information): ./af-iclme/layers/ideas/{IDEA-NAME}/changes/CHG-<id>/change-<id>
      - the walkthrough under: ./af-iclme/layers/ideas/{IDEA-NAME}/changes/CHG-<id>/walkthrough-<id>


