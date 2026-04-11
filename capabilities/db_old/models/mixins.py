from sqlalchemy import Column, DateTime
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID

class LifecycleMixin:
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    created_by = Column(UUID, nullable=True)
    updated_by = Column(UUID, nullable=True)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    deleted_by = Column(UUID, nullable=True)
