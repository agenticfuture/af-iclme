CREATE USER af_iclme_api WITH PASSWORD 'password';
-- CREATE USER servicegen_api WITH PASSWORD 'servicegen_api';
-- CREATE USER prefect_ WITH PASSWORD 'prefect';



GRANT ALL PRIVILEGES ON DATABASE af_iclme TO af_iclme_api;
-- GRANT ALL PRIVILEGES ON DATABASE servicegen TO servicegen_api;
-- GRANT ALL PRIVILEGES ON DATABASE prefect TO prefect_;

-- 
-- ALTER DATABASE keycloak OWNER TO keycloak;
-- ALTER DATABASE prefect OWNER TO prefect_;

-- privileges
-- REVOKE ALL ON DATABASE keycloak FROM PUBLIC;
-- GRANT CONNECT ON DATABASE keycloak TO keycloak;

-- REVOKE ALL ON SCHEMA public FROM PUBLIC;
-- GRANT USAGE ON SCHEMA public TO keycloak;



-- privileges -- with example: servicegen

-- Remove default access
-- REVOKE ALL ON DATABASE servicegen FROM PUBLIC;

-- Allow only the app role
-- GRANT CONNECT ON DATABASE servicegen TO servicegen_api;

-- For ServiceGen schemas
-- REVOKE ALL ON SCHEMA core FROM PUBLIC;
-- REVOKE ALL ON SCHEMA service FROM PUBLIC;
-- REVOKE ALL ON SCHEMA agent FROM PUBLIC;
-- REVOKE ALL ON SCHEMA workflow FROM PUBLIC;
-- REVOKE ALL ON SCHEMA channel FROM PUBLIC;
-- REVOKE ALL ON SCHEMA audit FROM PUBLIC;
-- REVOKE ALL ON SCHEMA private FROM PUBLIC;

-- Then grant only what’s needed:

-- GRANT USAGE ON SCHEMA core, service, agent, workflow, channel, audit TO servicegen_user;
-- GRANT USAGE ON SCHEMA private TO servicegen_api; -- only if app truly needs it

-- Tables

-- REVOKE ALL ON ALL TABLES IN SCHEMA core FROM PUBLIC;
-- REVOKE ALL ON ALL TABLES IN SCHEMA service FROM PUBLIC;

-- Grant only to the app role:

-- GRANT SELECT, INSERT, UPDATE, DELETE
-- ON ALL TABLES IN SCHEMA core, service
-- TO servicegen_api;

-- Sequences (often forgotten!)
-- REVOKE ALL ON ALL SEQUENCES IN SCHEMA core FROM PUBLIC;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA core TO servicegen_api;

-- Functions
-- REVOKE ALL ON ALL FUNCTIONS IN SCHEMA service FROM PUBLIC;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA service TO servicegen_api;


-- 4️⃣ Make it future-proof (default privileges)

-- Without this, new tables revert to insecure defaults.

-- Run as the schema owner
-- ALTER DEFAULT PRIVILEGES IN SCHEMA core
-- REVOKE ALL ON TABLES FROM PUBLIC;

-- ALTER DEFAULT PRIVILEGES IN SCHEMA core
-- GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO servicegen_api;


-- Repeat for:

-- service

-- agent

-- workflow

-- channel

-- audit

-- private (carefully!)

-- 5️⃣ Search path hardening (often skipped)

-- Prevents schema injection attacks.

-- ALTER ROLE servicegen_api
-- SET search_path = core, service, agent, workflow, channel, audit;


-- ⚠️ Do not include public unless needed.