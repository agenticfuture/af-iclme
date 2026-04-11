## Prompt for the AI agent:
(Execution plan template run #60)

Primary outcomes in this run:
- Audited `docker-compose.generated.yml` vs `docker-compose.staging.yml` for `service-gen-ai-chatbot` startup/runtime differences.
- Corrected chatbot image build behavior by removing DB migration from default build script.
- Kept migration as an explicit step (`db:migrate` or `build:with-migrate`) instead of implicit image-build side effect.
- Produced deployment guidance for staging/prod so migration happens as a controlled release action.

Tracking note:
- Full analysis and recommendations are recorded in CHG-056 walkthrough.
