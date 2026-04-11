## Prompt for the AI agent:
(Execution plan template run #43)

Primary outcomes in this run:
- Keep chatbot architecture unchanged: UI -> Next.js server-side -> service-gen-api -> stream back via Next.js.
- Align Next.js stream bridge with service-gen-api wrapper protocol (`/v1/language-model`).
- Improve token stream smoothness and remove protocol mismatch/glitches.
- Provide explicit DB service-list/get-service retrieval output.

Tracking note:
- Full implementation and verification are documented in CHG-039 walkthrough.
