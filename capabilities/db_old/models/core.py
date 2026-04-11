from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from db.base import Base
from db.models.mixins import LifecycleMixin

class Tenant(Base, LifecycleMixin):
    __tablename__ = "tenants"
    __table_args__ = {"schema": "core"}
    id = Column(UUID, primary_key=True)
    slug = Column(String, unique=True, nullable=False)
    status = Column(String, nullable=False)

class User(Base, LifecycleMixin):
    __tablename__ = "users"
    __table_args__ = {"schema": "core"}
    id = Column(UUID, primary_key=True)
    tenant_id = Column(UUID, ForeignKey("core.tenants.id"), nullable=False)
    external_id = Column(String, nullable=False)
    email_hash = Column(String, nullable=False)
    role = Column(String, nullable=False)
