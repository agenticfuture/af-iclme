
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
  - always follow the execution plan steps and the instructions provided within. you need to use uv (/app/.venv/bin/uv) if you want to install deps and also use the venv present inside the container
  - your code does not even upload the file. rechek again the whole process. I had a working version before...Are you sure you handle the multipart upload accordingly and that you set the correct form-data both on the frontend and the correct entity on the backend? at least we need to see the file not an empty array
  - when I mean data sources types, it does not mean many files first...It means data from different sources (what we have in the ui: (file, url, s3 bucket and so on...)) and that's what will constitute the bulk...
  - now since we won't handle each data source type the same way...Change the api route to match exactly the datasource. so you will have instead of /datasource, /file or /url or /aws-s3 and so on... and the workflow and tasks designed with prefect must reflect these...So make the changes.
  - thus the bulk part is essentially handled on the client side and each data source type must call its own end-point and when we click on the button add data source, it's added as well and if we only have one data source selected and value filled like what we have now, then when we click on next, it's going to read those value and make the post request or otherwise it will read all the existing added datasources via "add data source button" to make the request for each of them and display the status for each...if one fails, it does not move to the next step, less the user removes the one that fail and thus can move to the next step without having to make another api request (will be unncessary at this stage)
  - also the fields for each data source type in our case file upload must also be validated...Ensuring that it's not empty...otherwise we can't proceed
  - usually you will play on enabling the "next button" or not, when something is not right don't enable it, when it's all right, only then you enable it so you must take that into consideration as well and take all the cases that will make that button disable or enable and so on in your implementation...So go adhead and do the necessary
  
  - did not work...No buckets show in minio-ui











  - when finished, copy this file in the folder /already_run  under the execution-plans folder and indicate the correct numbering as the previous one, it is used to keep track of all the prompting
  - save also a copy of the walkthrough file you usually produce in the corresponding CHG-id folder for tracking as well

    
