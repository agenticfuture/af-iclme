AGENT-1:

   ROLE: 
   OBJECTIVE: 

   INPUT:
    - IDEA-NAME=create_service
    - DOMAIN= tenant
    - docs at:
        - ./af-iclme/layers/ideas/{IDEA-NAME}/requirements_spec.md
        - ./af-iclme/layers/ideas/{IDEA-NAME}/requirements_spec.yml
        - ./af-iclme/layers/ideas/{IDEA-NAME}/requirements_test_cases.md
        - ./af-iclme/layers/ideas/{IDEA-NAME}/requirements_test_cases.yml   
        - ./af-iclme/layers/ideas/{IDEA-NAME}/privacy_spec.md
        - ./af-iclme/layers/ideas/{IDEA-NAME}/privacy_spec.yml
        - ./af-iclme/layers/ideas/{IDEA-NAME}/privacy_test_cases.md
        - ./af-iclme/layers/ideas/{IDEA-NAME}/privacy_test_cases.yml
        - ./af-iclme/layers/ideas/{IDEA-NAME}/security_spec.md
        - ./af-iclme/layers/ideas/{IDEA-NAME}/security_spec.yml
        - ./af-iclme/layers/ideas/{IDEA-NAME}/security_test_cases.md
        - ./af-iclme/layers/ideas/{IDEA-NAME}/security_test_cases.yml
        - ./af-iclme/layers/ideas/{IDEA-NAME}/risks_spec.md
        - ./af-iclme/layers/ideas/{IDEA-NAME}/risks_spec.yml
        - ./af-iclme/layers/ideas/{IDEA-NAME}/risks_test_case.md
        - ./af-iclme/layers/ideas/{IDEA-NAME}/risks_test_case.yml
        - ./af-iclme/layers/ideas/{IDEA-NAME}/workflow.md
        - ./af-iclme/layers/ideas/{IDEA-NAME}/workflow.yml        

    


   OUTPUT:
   section 1:
    - expected implemented code based on project structure and provided files
    - expected implemented tests aligning with provided docs and project structures
    - a tracability matrix mapping code to req and tests implemented.

   section 2: additional relevant artifacts:
    - prompts file used.
    - change file describing the changes
    - walkthrough file on how the output was obtained




   TASKS/INSTRUCTIONS

    - for this don't do anything on the files. Analyse current code implementation and 
    just suggest what you will do and your implementation plan to align with all of this
    requirements at all the levels (files provided).
    - answer in the chat.

   
        
    - save all the generated test files under (ignore for now as you are only answering in the chat)
      - ./app/tests/{DOMAIN}/
    
    - save all the docs of section 2  under: (ignore for now as you are only answering in the chat)
      - the prompt used (the contain of this file) under : ./af-iclme/layers/ideas/{IDEA-NAME}/changes/CHG-<id>/prompts-<id>
      - the change file description under (it must contain the id, the name and the description of the change plus anyother relevant information): ./af-iclme/layers/ideas/{IDEA-NAME}/changes/CHG-<id>/change-<id>
      - the walkthrough under: ./af-iclme/layers/ideas/{IDEA-NAME}/changes/CHG-<id>/walkthrough-<id>


