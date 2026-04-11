
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from capabilities.customer.factory import mount_customer_domain
from capabilities.chatbot.factory import mount_chatbot_domain
from capabilities.channel.factory import mount_channel_domain
from capabilities.email.factory import mount_customer_domain
from capabilities.auth.factory import mount_auth_domain
from domains.service.factory import mount_service_domain

app = FastAPI(title="ServiceGen API")

mount_customer_domain(app)
mount_chatbot_domain(app)
mount_channel_domain(app)
mount_email_domain(app)
mount_auth_domain(app)
mount_service_domain(app)

"""
from fastapi import FastAPI
from servicegen.domains.customer.factory import mount_customer_domain

from servicegen.domains.crewai.factory import mount_crewai_domain
from servicegen.domains.ollama.factory import mount_ollama_domain
from servicegen.domains.retrieval.factory import mount_retrieval_domain
from servicegen.domains.system.factory import mount_system_domain

app = FastAPI(title="ServiceGen API")

mount_system_domain(app)
mount_customer_domain(app)
mount_retrieval_domain(app)
mount_ollama_domain(app)
mount_crewai_domain(app)
mount_chatbot_domain(app)

"""
#app.include_router(onboard_router, prefix="/api/customer", tags=["customer"])


# Configure CORS to allow requests from your Next.js app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000", "http://localhost:3002",  ], # Adjust port if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if __name__ == "__main__":
    print("running server")
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
