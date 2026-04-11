## Prompt for the AI agent:
(Execution plan template run #42)

Primary outcomes in this run:
- Preserve chatbot pipeline: UI -> Next.js server-side -> service-gen-api -> streamed response -> Next.js server -> UI.
- Improve streaming smoothness in chatbot UI to ChatGPT-like token flow with less jitter.
- Keep all existing service/job/state-machine/realm-scoped behavior unchanged.
- Provide explicit DB-backed service list/get-service retrieval path output.

Tracking note:
- Technical details and verification are documented in CHG-038 walkthrough.
