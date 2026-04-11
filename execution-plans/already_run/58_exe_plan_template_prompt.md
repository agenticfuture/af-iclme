## Prompt for the AI agent:
(Execution plan template run #58)

Primary outcomes in this run:
- Created a complete enterprise-grade Helm chart for Keycloak under the ServiceGen umbrella.
- Rebuilt the Prefect chart to enterprise baseline (deployment, PVC, secret/config, service, network policy, probes, PDB, optional ingress/HPA).
- Wired both charts into umbrella values for local/staging.ovh/prod.ovh with compose-aligned env and secret keys.
- Deployed both releases in Kubernetes and verified healthy runtime status.

Tracking note:
- Full implementation and deployment verification details are recorded in CHG-054 walkthrough.
