## Prompt for the AI agent:
(Execution plan template run #48)

Primary outcomes in this run:
- Renamed OVH profile files to explicit environment names: staging.ovh and prod.ovh.
- Tuned OVH staging and OVH production Postgres profiles for startup cost-efficiency with clear production boundaries.
- Preserved local profile and cross-environment env-key compatibility to minimize .env changes during promotion.
- Updated deployment documentation and validated all three profiles.

Tracking note:
- Full implementation and verification details are recorded in CHG-044 walkthrough.
