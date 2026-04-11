import uuid
from faker import Faker
from db.session import SessionLocal
from db.models.core import Tenant, User
from db.models.private import UserPII

fake = Faker()

def seed(count=5):
    db = SessionLocal()
    t = Tenant(id=uuid.uuid4(), slug=fake.slug(), status="active")
    db.add(t)
    for _ in range(count):
        u = User(
            id=uuid.uuid4(),
            tenant_id=t.id,
            external_id=str(uuid.uuid4()),
            email_hash=fake.sha256(),
            role="agent",
        )
        db.add(u)
        db.add(UserPII(user_id=u.id, email_enc=fake.email().encode()))
    db.commit()
    print("Seeded")

if __name__ == "__main__":
    seed()
