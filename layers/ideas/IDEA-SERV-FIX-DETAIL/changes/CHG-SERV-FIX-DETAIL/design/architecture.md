# Architecture Design: ServiceGen Bug Fix & Enhancement

## Overview
This change addresses a critical frontend rendering error in `ServiceDetailPage` and finalizes the bot creation flow to include robust data ingestion and bot deployment.

## Frontend Components
- **ServiceDetailPage**: Displays service info and embed code. Needs a fix for the `performance.measure` error.
- **ServiceWizard**: 5-step process. Needs to preserve `serviceId` and `chatbotId` across steps and use them in the final deployment trigger.

## Backend Components
- **Onboarding API**: Handles service and bot creation steps.
- **Deployment API**: Finalizes the service, triggers embedding, and updates DB status.
- **Embedding Capability**: Processes data sources and stores them in Qdrant with `service_id` and `tenant_id` for isolation.

## Data Model
- **Qdrant**: Points are tagged with `service_id` and `tenant_id`.
- **Database**: Stores `chatbot_id`, `service_id`, and deployment status.
