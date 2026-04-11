# Analytics Privacy Traceability Report

## Controls To Tests
- No raw message payload leakage in export:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/tests/test_analytics_privacy_contract.py::test_analytics_export_does_not_leak_message_payloads_or_encrypted_columns`
- No encrypted storage column leakage in export:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/tests/test_analytics_privacy_contract.py::test_analytics_export_does_not_leak_message_payloads_or_encrypted_columns`
- Aggregate-only services export:
  - `/Users/franck/Documents/projects/ServiceGenMeta/ServiceGen/app/ingress/api/tests/test_analytics_privacy_contract.py::test_analytics_services_export_is_aggregate_only`

## Execution Result
- Executed in normal `service-gen-api` container
- Aggregate result:
  - `2 passed in 62.29s`
