# Hypothesis

By implementing multi-step persistence in the frontend wizard (sending POST requests at each "Next" click) and correctly handling the `service_id` and `chatbot_id` in the backend, we can ensure that the service configuration is progressively saved and ready for deployment. Linking the final "Finish" action to a deployment trigger will activate the service and make it available in the playground.

## Verification
- Step 1: Draft service created in DB.
- Step 2: Chatbot created and linked to service.
- Step 3/4: Simulated POST requests received by API.
- Step 5: Service becomes ACTIVE and user is redirected to `/dashboard/services/{id}`.
