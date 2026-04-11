from alembic import context
from db.base import Base
from db.engine import engine
from db.models import core, private

target_metadata = Base.metadata

with engine.connect() as connection:
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        include_schemas=True,
    )
    with context.begin_transaction():
        context.run_migrations()
