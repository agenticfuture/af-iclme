

# note on capabilities

## description
capabilities (caps for short) are the base brick for the whole system design. They basically represent a single action that can be performed on the system and they are wrapped up around a single domain.

The capabilities are made of the combination of the following components which are selected based on the task or action of which the code needs to be written. They include:

- handler: orchestrates how the cap is run
- workflow: orchestrates how the cap is run
- tasks: tasks that are run by the workflow
- functions: functions that are run by the workflow
- entities: entities that are used by the workflow
- contracts: contracts that are used by the workflow
- normalize: normalize that is used by the workflow
- api: 
- main.py: if we want to run code the cap itself
- shared folder:
- adapters folder: if needed 
- providers folder: if needed 
- constants
- any other files or folder necessary to have clean code


now each cap lives inside the caps folder under the domain folder. The following is an example of the email domain with capabilities: onboard-channel and activate-oauth.

    email/
      __init__.py
      providers/
        __init__.py
        registry.py
        gmail_adapter.py
        m365_adapter.py
        imap_adapter.py
        smtp_sender.py
        gmail_sender.py
        m365_sender.py

      shared/
        __init__.py
        entities.py
        contracts.py
        normalize.py
        redis_io.py
        channel_store.py
        routing_rules.py
        security.py
        errors.py
        settings.py

      caps/
        onboard-channel/
          __init__.py
          handler.py
          workflow.py
          tasks.py
          functions.py
          entities.py

        activate-oauth/
          __init__.py
          handler.py
          workflow.py
          tasks.py
          functions.py

for the project as you will see, each domain lives inside the capabilities folder.

- One can refer to some capabilities to understand even better

# note on coding style
you must follow the following:
- no workflow must be more than 30 steps as well as any functions, if the cap workflow is more than 30 steps, break the cap into sub-caps, same for the functions, we use prefect for the workflow...
- each capability must always have a handler, a workflow that orchestrates how the cap is run and the handler only runs it, entities, functions (that will be called by the workflow (which creates tasks)) and necessary components to code the capability correctly.
- always separate base_url from full routes plus no base_url and full routes must be written in the code. They must always be kept splitted and separated 
  - This is especially for (especially wit nextjs) which might not have a way like fastapi to collect all routes immediately
- always ensure that coding style will in no way block smooth transitions across environments (so that must always be taken into consideration)
- remember that the code must be secured,simple, easy to read , well structured and we must always have at the end a workflow (here we use prefect) so that everything is fully seen and well understood.



