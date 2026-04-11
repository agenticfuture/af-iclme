# idea execution plan template: v0.9

## description
this execution plan describe the Idea execution from ideation to audit going through all the main stages of the idea creation.


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
  File "<frozen importlib._bootstrap>", line 488, in _call_with_frames_removed

  File "/app/main.py", line 8, in <module>

    from capabilities.channel.factory import mount_channel_domain

  File "/app/capabilities/channel/factory.py", line 2, in <module>

    from capabilities.channel.caps.create.api import router as channel_router

  File "/app/capabilities/channel/caps/create/api.py", line 8, in <module>

    from capabilities.email.caps.create_channel.handler import run as email_handler

  File "/app/capabilities/email/caps/create_channel/handler.py", line 2, in <module>

    from .workflow import flow_onboard_channel

  File "/app/capabilities/email/caps/create_channel/workflow.py", line 4, in <module>

    from capabilities.email.caps.test_channel.workflow import flow_test_channel

  File "/app/capabilities/email/caps/test_channel/workflow.py", line 3, in <module>

    from .tasks import t_healthcheck, t_send_test

  File "/app/capabilities/email/caps/test_channel/tasks.py", line 2, in <module>


correct this
    
