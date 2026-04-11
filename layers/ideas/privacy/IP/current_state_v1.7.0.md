# Privacy Current State v1.7.0

## Status
- Real export payload assembly has been implemented in source.
- The SaaS privacy request flow continues to work through the real proxy path.
- The currently running API container is still serving the older inventory-only export behavior.

## Newly Implemented In Source
- Core export payload assembly:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/privacy/adapters/core_subject_reader.py`
- Chatbot export payload assembly:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/privacy/adapters/chatbot_subject_reader.py`
- Export response now supports a real payload:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/privacy/shared/entities.py`
- Export cap now returns:
  - inventory
  - structured export payload
  - `status="export_ready"`
  - file:
    - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/privacy/caps/export_subject_data/functions.py`
- Tracked privacy requests now store export payload in their result summary:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/privacy/caps/create_subject_request/functions.py`

## Additional Fix
- Removed the heavy auth import from the privacy path and switched to the lightweight hash helper:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/capabilities/privacy/adapters/core_subject_reader.py`
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/tests/test_privacy_export_contract.py`
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/tests/test_privacy_request_status_contract.py`

## Verified
- Python syntax compilation passed for the updated export and request files.
- Real SaaS runtime flow still works for:
  - privacy page
  - request creation
  - request status
  - request detail page

## Runtime Boundary
- The live SaaS proxy probe still returned inventory-only request summaries.
- This indicates the running `service-gen-api` container has not picked up the new source-level export payload code yet.
- A restart alone was not sufficient.

## Meaning
- Source implementation: ahead
- Running API container: behind

## Immediate Next Step
- Rebuild or recreate `service-gen-api` from the updated source, then rerun the focused privacy SaaS proxy probe to confirm:
  - `result_summary.status = "export_ready"`
  - `result_summary.export_payload` present
