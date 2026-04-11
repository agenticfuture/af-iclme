

SELECT 'CREATE DATABASE af_iclme'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'af_iclme')\gexec

-- SELECT 'CREATE DATABASE servicegen'
-- WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'servicegen')\gexec

-- SELECT 'CREATE DATABASE prefect'
-- WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'prefect')\gexec


-- CREATE EXTENSION IF NOT EXISTS pg_trgm;