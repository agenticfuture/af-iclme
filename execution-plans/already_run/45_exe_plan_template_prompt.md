## Prompt for the AI agent:
(Execution plan template run #45)

Primary outcomes in this run:
- Remove Prefect runtime dependency from chatbot streaming hot path.
- Keep required architecture unchanged: UI -> Next.js server -> service-gen-api -> streamed response -> Next.js -> UI.
- Fix stream proxy parsing so upstream error events are not silently swallowed and deltas render progressively.
- Validate stream behavior from live container after reload.

Tracking note:
- Implementation details and verification evidence are recorded in CHG-041 walkthrough.
