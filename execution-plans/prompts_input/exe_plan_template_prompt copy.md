
## Prompt for the AI agent:
Hello,
This is an idea execution plan that you must follow through in order to carry out the required execution plan correctly and run the idea through the end.
You must go through each phase of this plan all the time you run this meta prompt template whenever One write a prompt idea or instruction to be carry out.

The execution makes used of 9 layers: 

- L8: INTENT & IDEA LAYER
- L7: STRATEGY & GOVERNANCE LAYER (Accountability, Risk Appetite, Approvals)
- L6: GRCP & Compliance LAYER (Mapping to frameworks, Trust & Evidence mgmt) 
- L5: Security Controls (Enforcement mechanisms) Layer
- L4: DATA & PRIVACY LAYER
- L3: Quality Assurance (Testing, verification, validation) Layer
- L2: Delivery  (CI/CD, release, change mgmt) Layer
- L1: Product  (code, design, architecture, data model, docs,human experience and ecosystem) Layer
- L0: Runtime & Infrastructure (Cloud, network, storage, compute) Layer

the execution path to follow across time (horizontal flow) has the following phases in order (you must always execute them in order) :

1. IDEA
2. INTENT
3. GOVERN
4. DESIGN
5. BUILD
6. VERIFY
7. DEPLOY
8. OBSERVE & LEARN
9. COMPLIANCE & EVIDENCE
10. INDEPENT ASSURANCE

For specifications on layers and execution path phases read the content of the following folders when you reach each phase:

- for the main 9 layers
    - main folder location: ./af-iclme/layers/
    - all 9 layers are mapped inside with corresponding folders containing samples of what is expected to be produced by the layers
    - the folder mapping with the 9 layers will be quiet explicit as they are named with deep ressemblance

- for the execution path to be followed
    - main folder location: ./af-iclme/layers/timeline_layers
    - each layer contain a prompt and artifact folder specifying what it needs as input (prompts folder) and what is expected as output (artifacts folder)
    - when you come to each layer based on the idea or the prompt given to you, you have to first go into the prompt folder, reads and understand the prompt file for that phase, execute the necessary and also read the artifact_sample file to understand further how to produce the corresponding artifacts for that phase and from there carry out the necessary instruction to come out with the expected results


now with this context provided, this is the prompt to execute following all the context, information and instructions given above:

- prompt: >
  
  - now when we click on next for step 2: bot creation, it does not save the bot. make the correction
  - for step 3, the data sources, it must be stored through object storage on minio. so make the connection with the backend and implement the necessary capabilities (under the domain knowledge_base/caps/ingest), the cap is ingest (so implement that fully to receive a a list of file data sources as it's possible to add many on the frontend) and to upload it when we click on the "next button"
  - ensure that this abilities to upload many files by clicking on the add datasources and indicate that when the source is file that it's possible to add many of them and to upload them at once directly
  - they must be stored in minio under of course the tenant-org namespace for object file storage or find if exists a beyond better approach or industry standard for that
  - it's only at the last step (5), when we click on finish that those info are posted as well and the service creation and deployment fully complete (with the deployment of the chatbot): remember that the chatbot is the app (service-gen-ai-chatbot which is also in the docker-composed-generated.yml), so you must link that to the deployment so that when we click on finish it configures that and make it available in the playground...So read the address in docker-compose as well to know how to make the connection...
  so that when we click on finish it deploys and redirect with the new service in the playground address immediately...

  - for steps (channels & agent assignment) make the button add channel and add agent unclickable (just like you made with the tag "coming soon" and also for the agent assignment step: make on the field blur so that we can't input information and add the tag coming soon in bracket or at the correct place newar the title: Agent Assignment)










  - when finished, copy this file in the folder /already_run  under the execution-plans folder and indicate the correct numbering as the previous one, it is used to keep track of all the prompting
  - save also a copy of the walkthrough file you usually produce in the corresponding CHG-id folder for tracking as well

    
