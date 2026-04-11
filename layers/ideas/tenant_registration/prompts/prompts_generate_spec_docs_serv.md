AGENT-1:

   ROLE: 
   OBJECTIVE: 

   INPUT:
    - docs at:
        - ./af-iclme/layers/product/system_requirements/ServiceGen_BRD_v.0.9.0.md
        - ./af-iclme/layers/product/system_requirements/ServiceGen_BRD_v.0.9.0.yml
        - ./af-iclme/layers/privacy/privacy_system_spec_reqs.yml
        - ./af-iclme/layers/privacy/privacy-test-cases.yml
        - ./af-iclme/layers/security/security_system__specs.yml
        - ./af-iclme/layers/security/security_test_case_specs.md
        - ./af-iclme/layers/governance/ServiceGen-Risk-Register-Template.md
    - IDEA-NAME=create_service
    


   OUTPUT:
   following docs:
   section 1:
    - requirements_spec.md
    - requirements_spec.yml
    - requirements_test_cases.md
    - requirements_test_cases.yml   
    - privacy_spec.md
    - privacy_spec.yml
    - privacy_test_cases.md
    - privacy_test_cases.yml
    - security_spec.md
    - security_spec.yml
    - security_test_cases.md
    - security_test_cases.yml
    - risks_spec.md
    - risks_spec.yml
    - risks_test_case.md
    - risks_test_case.yml
   
   section 2: additional relevant artifacts:
    - prompts file used.
    - change file describing the changes
    - walkthrough file on how the output was obtained




   TASKS/INSTRUCTIONS

    - generate based on the input documents (linked to the system) provided, the list of expected docs (in section 1) described in the output section
    focusing on the : {IDEA-NAME} requirement.

    - some note on how you will analyse the existing create_service flow in the frontend (app, as you have seen and in the backend cap).
    - the create_service works with several entities as you will see as you examine the flow in servicegen-saas and also in the api
    - they include (service, chatbot, datasource/source of truth,channels (for now it's left first),HumanAgent,finish (when clicked))
    - after the user clicks on that (finish), then it has to deploy (in the playground) the bot as you will see or have seen in the code and provide iframe code/ javascripts/object, react js...
    - so the playground must be working and you have to ensure it does and take that into your analysis as you are producing the report.
    - only analyse the current code and don't make any code modifs for now (just understand what is there and go through the system docs provided to produce the expected output based on all the info provided and the current existing system state analysis)

        
    - save all the docs of section 1  under 
      - ./af-iclme/layers/ideas/{IDEA-NAME}/
    
    - save all the docs of section 2  under:
      - the prompt used (the contain of this file) under : ./af-iclme/layers/ideas/{IDEA-NAME}/changes/CHG-<id>/prompts-<id>
      - the change file description under (it must contain the id, the name and the description of the change plus anyother relevant information): ./af-iclme/layers/ideas/{IDEA-NAME}/changes/CHG-<id>/change-<id>
      - the walkthrough under: ./af-iclme/layers/ideas/{IDEA-NAME}/changes/CHG-<id>/walkthrough-<id>


