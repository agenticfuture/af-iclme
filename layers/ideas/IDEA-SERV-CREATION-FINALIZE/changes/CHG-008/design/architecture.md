# Architecture - Wizard Persistence & Deployment

## Sequence Diagram

```mermaid
sequenceDiagram
    participant UI as Wizard (Frontend)
    participant API as Service API
    participant BotApp as Chatbot App

    UI->>API: Next (Step 1): POST /services
    API-->>UI: 200 {service_id}
    
    UI->>API: Next (Step 2): POST /services/{id}/chatbot
    API-->>UI: 200 {chatbot_id}
    
    UI->>API: Next (Step 3): POST /services/{id}/data-sources (Simulated)
    API-->>UI: 200 {status: success}
    
    UI->>API: Next (Step 4): POST /services/{id}/channels (Simulated)
    API-->>UI: 200 {status: success}
    
    UI->>API: Finish (Step 5): POST /services/{id}/deploy
    API->>API: Update Service ACTIVE, Create Deployment
    API-->>UI: 200 {status: success}
    
    UI->>UI: Redirect to /dashboard/services/{id}
```

## Integration Details
- **Chatbot App**: Linked via `service_id` and `chatbot_id`. The playground will eventually point to `bot.servicegen.local?service_id={id}`.
- **Simulated Steps**: Steps 3 and 4 will hit generic "patch" or "update" endpoints that return success for now.
