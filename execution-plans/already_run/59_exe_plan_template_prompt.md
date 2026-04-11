## Prompt for the AI agent:
(Execution plan template run #59)

Primary outcomes in this run:
- Rebuilt MinIO and Ollama Helm charts to enterprise-grade baseline.
- Created a new Traefik Helm chart and integrated it under the ServiceGen umbrella chart.
- Added local/staging.ovh/prod.ovh value separation for MinIO, Ollama, and Traefik.
- Deployed all three charts to Kubernetes and verified healthy runtime status.

Tracking note:
- Full implementation and verification details are recorded in CHG-055 walkthrough.
