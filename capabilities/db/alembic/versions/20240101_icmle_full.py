
"""ICLME Full Core Schema

Revision ID: 20240101_icmle_full
Revises:
Create Date: 2024-01-01
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '20240101_icmle_full'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():

    # ============================
    # PROJECTS
    # ============================
    op.create_table(
        'projects',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('project_key', sa.String(20), unique=True, nullable=False),
        sa.Column('name', sa.Text(), nullable=False),
        sa.Column('description', sa.Text()),
        sa.Column('project_type', sa.String(50), nullable=False),
        sa.Column('lifecycle_model', sa.String(50), server_default='spiral'),
        sa.Column('risk_profile', sa.String(20), server_default='medium'),
        sa.Column('status', sa.String(20), server_default='active'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now())
    )

    # ============================
    # DOMAINS
    # ============================
    op.create_table(
        'domains',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(100), unique=True, nullable=False),
        sa.Column('description', sa.Text())
    )

    # ============================
    # IDEA TYPES
    # ============================
    op.create_table(
        'idea_types',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(100), unique=True, nullable=False),
        sa.Column('description', sa.Text())
    )

    # ============================
    # IDEAS
    # ============================
    op.create_table(
        'ideas',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('project_id', postgresql.UUID(as_uuid=True),
                  sa.ForeignKey('projects.id'), nullable=False),
        sa.Column('idea_key', sa.String(50), unique=True, nullable=False),
        sa.Column('idea_name', sa.String(120), nullable=False),
        sa.Column('idea_description', sa.Text(), nullable=False),
        sa.Column('prompt_description', sa.Text()),
        sa.Column('prompt_used', sa.Text()),
        sa.Column('prompt_link', sa.Text()),
        sa.Column('idea_status', sa.String(50), server_default='backlog'),
        sa.Column('priority', sa.String(20), server_default='medium'),
        sa.Column('severity', sa.String(20)),
        sa.Column('story_points', sa.Integer()),
        sa.Column('effort_estimate', sa.Integer()),
        sa.Column('owner_id', sa.String(100)),
        sa.Column('reporter_id', sa.String(100)),
        sa.Column('spiral_stage', sa.String(50), server_default='IDEA'),
        sa.Column('risk_level', sa.String(20), server_default='low'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now())
    )

    op.create_table(
        'idea_domains',
        sa.Column('idea_id', postgresql.UUID(as_uuid=True),
                  sa.ForeignKey('ideas.id'), primary_key=True),
        sa.Column('domain_id', postgresql.UUID(as_uuid=True),
                  sa.ForeignKey('domains.id'), primary_key=True)
    )

    op.create_table(
        'idea_type_map',
        sa.Column('idea_id', postgresql.UUID(as_uuid=True),
                  sa.ForeignKey('ideas.id'), primary_key=True),
        sa.Column('type_id', postgresql.UUID(as_uuid=True),
                  sa.ForeignKey('idea_types.id'), primary_key=True)
    )

    # ============================
    # CHANGES
    # ============================
    op.create_table(
        'changes',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('project_id', postgresql.UUID(as_uuid=True),
                  sa.ForeignKey('projects.id'), nullable=False),
        sa.Column('idea_id', postgresql.UUID(as_uuid=True),
                  sa.ForeignKey('ideas.id')),
        sa.Column('change_key', sa.String(50), unique=True, nullable=False),
        sa.Column('title', sa.Text(), nullable=False),
        sa.Column('description', sa.Text()),
        sa.Column('current_stage', sa.String(50), server_default='IDEA'),
        sa.Column('status', sa.String(50), server_default='open'),
        sa.Column('risk_level', sa.String(20)),
        sa.Column('autonomy_allowed', sa.Boolean(), server_default='false'),
        sa.Column('change_spec_uri', sa.Text()),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now())
    )

    # ============================
    # ARTIFACTS
    # ============================
    op.create_table(
        'artifacts',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('project_id', postgresql.UUID(as_uuid=True),
                  sa.ForeignKey('projects.id'), nullable=False),
        sa.Column('change_id', postgresql.UUID(as_uuid=True),
                  sa.ForeignKey('changes.id'), nullable=False),
        sa.Column('layer', sa.String(10), nullable=False),
        sa.Column('artifact_type', sa.String(100), nullable=False),
        sa.Column('content_yaml', sa.Text()),
        sa.Column('content_text', sa.Text()),
        sa.Column('content_markdown', sa.Text()),
        sa.Column('content_json', postgresql.JSONB),
        sa.Column('uri', sa.Text()),
        sa.Column('code_ref', sa.String(255)),
        sa.Column('external_ref', sa.Text()),
        sa.Column('version', sa.Integer(), server_default="1"),
        sa.Column('checksum', sa.String(255)),
        sa.Column('immutable', sa.Boolean(), server_default="false"),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('created_by', sa.String(100))
    )

    # ============================
    # EVENTS (Event Store)
    # ============================
    op.create_table(
        'events',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('project_id', postgresql.UUID(as_uuid=True),
                  sa.ForeignKey('projects.id'), nullable=False),
        sa.Column('aggregate_type', sa.String(50), nullable=False),
        sa.Column('aggregate_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('layer', sa.String(10), nullable=False),
        sa.Column('spiral_stage', sa.String(50), nullable=False),
        sa.Column('event_type', sa.String(100), nullable=False),
        sa.Column('payload', postgresql.JSONB, nullable=False),
        sa.Column('version', sa.Integer(), nullable=False),
        sa.Column('correlation_id', postgresql.UUID(as_uuid=True)),
        sa.Column('causation_id', postgresql.UUID(as_uuid=True)),
        sa.Column('actor_type', sa.String(50)),
        sa.Column('actor_id', sa.String(100)),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now())
    )


def downgrade():
    op.drop_table('events')
    op.drop_table('artifacts')
    op.drop_table('changes')
    op.drop_table('idea_type_map')
    op.drop_table('idea_domains')
    op.drop_table('ideas')
    op.drop_table('idea_types')
    op.drop_table('domains')
    op.drop_table('projects')
