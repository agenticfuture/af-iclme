
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
  - you must not have remove the section of the code in the frontend that create the service and the bot? (cause it's through that you get all the necessary ids)
  - make sure not to encode routes in the codes, centralize them and use them accordinly (through a list?)
  - also all base url must be treated as .env var...Check all the code to make sure that it follows that strictness accordinly and if it does not follow, refactor the code to account for that.
  - now when it redirect to the playground, you must use the bot service app (container: bot.servicegen.local), to parametize that bot to be loaded and receive queries only for that tenant,org,service and redirect and post query only in that realm (teant_id,org_id,service_id,), so that multiple tenants can have many services/bots related running yet each context is clearly separated and different.
  - so there must be also the copy and paste code shown in the playground updated when we click on (view all embed options: these sections must be clearly updated and presented to the user when they click on that button)
  - now you need to know that the txt are streamed from the backend side of the bot app (cause there's the backend side handled by nextjs in the route as you have seen...and thus it was already implemented with a vercel ai custom gateway as you will see and it was streaming the txt msg from that to the ui)cause it's that backend that actually talks with service-gen-api to get the info and you will also see that it goes through the cap under the chatbot domain (handle_request:), thus with that that's where the request reaches the api and it's from there that's all the processing happens and everything is return to back to the bot backend (nextjs) which streamline it to the frontend. so with the need params adding for the realm (tenant,...serice), make the correct modif so that when we write a query in the bot, it goes through that process accordingly and only look for info in its realm and return that to the user...
  - also you will that there's is db for this bot...and even if you see they launch in cmd in the docker-compose.generated.yml, there is cmd that is used to run migration for this db, you need to relocate that to our actual local db system so that it no longer goes online to store db info...



now go adhead and perform everything







  - when finished, copy this file in the folder /already_run  under the execution-plans folder and indicate the correct numbering as the previous one, it is used to keep track of all the prompting
  - save also a copy of the walkthrough file you usually produce in the corresponding CHG-id folder for tracking as well

    
