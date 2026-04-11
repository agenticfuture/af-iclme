## Prompt for the AI agent:
(Execution plan template run #41)

Primary outcomes in this run:
- Preserve chatbot request pipeline: UI -> Next.js server-side -> service-gen-api -> streamed response -> Next.js server -> UI.
- Fix Prefect cancellation crash observed in embeddings search path.
- Keep all previously delivered service lifecycle/job/state-machine/realm-scoped behavior.
- Provide explicit reference for DB-backed service list retrieval implementation.

Tracking note:
- Full technical details and verification are documented in CHG-037 walkthrough.
