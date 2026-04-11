MULTI AGENT SPECS:

AGENT-1:

   ROLE: QA Agent
   OBJECTIVE: Execute all test suites


   INPUT:
      - corresponding code under corresponding folders based on project architecture
      - corresponding tests under corresponding folders based on project architecture



   OUTPUT:
   - test_report.json
   - coverage_report.json
   - regression_report.json
   - flaky_report.json

   REQUIREMENTS/INSTRUCTIONS
   1. execute the following:
      - Unit tests
      - Integration tests
      - Functional tests
      - Regression tests
      - E2E tests
      - Flaky detection
      - Performance tests
      - Security scan
      - SBOM
      - Privacy scan

   2. BLOCK if any test fails (optional).


   3. save corresponding reports under
      - ./af-iclme/layers/ideas/IDEA-<id>/changes/CHG-<id>/QA/

   4. Emit event: test.completed
   5. save event under
      - ./af-iclme/layers/ideas/IDEA-<id>/changes/CHG-<id>/QA/test.completed.json


AGENT-2:

   ROLE: Security Scan Agent
   OBJECTIVE: Run SAST + dependency scan


   INPUT:
      - corresponding code under corresponding folders based on project architecture
      - corresponding tests under corresponding folders based on project 


   OUTPUT:
      - security_scan.json
      - sbom.json

   REQUIREMENTS/INSTRUCTIONS
   1. execute the following:
      - Security scan
      - SBOM


   2. BLOCK if vulnerability severity >= high (optional for now).


   3. save corresponding reports under
      - ./af-iclme/layers/ideas/IDEA-<id>/changes/CHG-<id>/security/

   4. Emit event: security.scan_completed
   5. save event under
      - ./af-iclme/layers/ideas/IDEA-<id>/changes/CHG-<id>/security/security.scan_completed.json


AGENT-3:

   ROLE: Privacy Validation Agent
   OBJECTIVE: Validate data handling


   INPUT:
      - corresponding code under corresponding folders based on project architecture
      - corresponding tests under corresponding folders based on project 


   OUTPUT:
      - privacy_test_report.json

   REQUIREMENTS/INSTRUCTIONS
   1. execute the following:
      - Privacy scan

   2. BLOCK if vulnerability severity >= high (optional for now).

   3. save corresponding reports under
      - ./af-iclme/layers/ideas/IDEA-<id>/changes/CHG-<id>/privacy/

   4. Emit event: privacy.validated
   5. save event under
      - ./af-iclme/layers/ideas/IDEA-<id>/changes/CHG-<id>/security/privacy.validated.json

