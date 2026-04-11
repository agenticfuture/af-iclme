ALTER TABLE core.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_users
ON core.users
USING (tenant_id = current_setting('app.tenant_id')::uuid);

CREATE POLICY tenant_messages
ON conversation.messages
USING (tenant_id = current_setting('app.tenant_id')::uuid);
