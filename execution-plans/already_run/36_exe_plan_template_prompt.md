
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
  - always follow the execution plan steps and the instructions provided within. you need to use uv (/app/.venv/bin/uv) if you want to install deps and also use the venv present inside the container.
  - if you want to execute a cmd? first confirm approval and then read the docker-compose.generated.yml to know the service and use the venv (/app/.venv/bin/)
  - if you have to install a necessary package for your work even in nextjs apps, you can just look at the docker-compose.generated.yml and use pnpm to install the package (run it from the docker-compose ) and perform your work
  - you must not have remove the section of the code in the frontend that create the service and the bot? (cause it's through that you get all the necessary ids)
  - make sure not to encode routes in the codes, centralize them and use them accordinly (through a list?)
  - now when it redirect to the playground, you must use the bot service app (container: bot.servicegen.local), to parametize that bot to be loaded and receive queries only for that tenant,org,service and redirect and post query only in that realm (teant_id,org_id,service_id,), so that multiple tenants can have many services/bots related running yet each context is clearly separated and different.
  - also I see that some of your caps are empty under the service domain...for eg the get_service cap is empty so just output for this how you get the list of services from the db to populate the ui
  - also add also the option on the service list in the ui the button to change the status of the service and also the modify button to go directly to the modify page of the service.
  - now make correct change for the status cause an archived status cannot have any deployment and it must be put down
  - also make a button to modify the status of  the deployment from the db
  - all of this must be implementing a correct state machine transition so ensure correctness of execution and state transition and each change of state must trigger and have all its correct impact implemented and verified

  - now for the create service or even modify service flow, the way it's going to be is that, you have to enqueue jobs in the backend (especially for embeddings creation from data sources,that job must be enqueue in the backend) also when we click next, you don't show any progress bar while you create the service or the bot, it must just move to the next step when the bot or service is correctly created. now as from step 3, this is where you will have to enqueue jobs in the backend and only when the user click on finish that you make the whole screen like blur (just like there's work behing like other platform do it) and you show that progress bar starting with saying like "finishing the configuration of your service" or even something better (propose) and then all the backend jobs are running and the service is fully configured and deployed only then you redirect to the playground and the user can start now asking question about the data that were uploaded.
  - so make all the necessary refactoring (especially in the file flow datasource where there's an embedding instruction) and ensure everything works well
  - also you will have to therefore also create a job domain, under it create a folder caps with the cap: "create_job" to be able to create-jobs and afterward execute them, having said that you will also need therefore to create a table for that in the db domain to be able to store the job and afterward load it with its param and execute it (do it as the industry are usually doing it and make sure it's complete and beyond level), create all the necessary migrations and run them...Make everything clean and smooth

  - Access to fetch at 'https://api.servicegen.local/api/knowledge-base/services/cfc202d0-9e67-4162-802f-83890628f094/ingest/file' from origin 'https://saas.servicegen.local' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.Understand this error
file:1  Failed to load resource: net::ERR_FAILEDUnderstand this error
page.tsx:1614 Save failed Error: Sync failed for file: Files
    at onClick 

fix this

now go adhead and perform everything







  - when finished, copy this file in the folder /already_run  under the execution-plans folder and indicate the correct numbering as the previous one, it is used to keep track of all the prompting
  - save also a copy of the walkthrough file you usually produce in the corresponding CHG-id folder for tracking as well

    
