-- App role
CREATE ROLE servicegen_app LOGIN PASSWORD 'REDACTED';
CREATE ROLE servicegen_backend LOGIN PASSWORD 'REDACTED';
-- Read-only analytics
CREATE ROLE servicegen_readonly;

-- Permissions
GRANT USAGE ON SCHEMA core, conversation, audit TO servicegen_app;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA core, conversation TO servicegen_app;

REVOKE ALL ON SCHEMA private FROM servicegen_app;

--
REVOKE ALL ON SCHEMA private FROM public;
REVOKE ALL ON ALL TABLES IN SCHEMA private FROM public;

-- grant only to backend role
GRANT USAGE ON SCHEMA private TO servicegen_backend;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA private TO servicegen_backend;