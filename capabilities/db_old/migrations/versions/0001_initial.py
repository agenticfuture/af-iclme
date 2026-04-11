from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        "tenants",
        sa.Column("id", postgresql.UUID(), primary_key=True),
        sa.Column("slug", sa.String(), nullable=False),
        sa.Column("status", sa.String(), nullable=False),
        schema="core",
    )
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(), primary_key=True),
        sa.Column("tenant_id", postgresql.UUID(), nullable=False),
        sa.Column("external_id", sa.String(), nullable=False),
        sa.Column("email_hash", sa.String(), nullable=False),
        sa.Column("role", sa.String(), nullable=False),
        schema="core",
    )
    op.create_table(
        "user_pii",
        sa.Column("user_id", postgresql.UUID(), primary_key=True),
        sa.Column("email_enc", postgresql.BYTEA(), nullable=False),
        schema="private",
    )

def downgrade():
    op.drop_table("user_pii", schema="private")
    op.drop_table("users", schema="core")
    op.drop_table("tenants", schema="core")
