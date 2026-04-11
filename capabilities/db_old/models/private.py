from sqlalchemy import Column, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, BYTEA
from db.base import Base

class UserPII(Base):
    __tablename__ = "user_pii"
    __table_args__ = {"schema": "private"}
    user_id = Column(UUID, ForeignKey("core.users.id", ondelete="CASCADE"), primary_key=True)
    email_enc = Column(BYTEA, nullable=False)
