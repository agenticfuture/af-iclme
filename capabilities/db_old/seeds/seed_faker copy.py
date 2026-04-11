import uuid
import sys
from faker import Faker
from db.session import SessionLocal
from db.models.core import User
from db.models.conversation import Message

fake = Faker()

def seed(users=10, messages=100):
    db = SessionLocal()
    tenant_id = uuid.uuid4()

    user_ids = []

    # Users
    for _ in range(users):
        u = User(
            id=uuid.uuid4(),
            tenant_id=tenant_id,
            external_id=f"kc-{uuid.uuid4()}",
            email_hash=fake.sha256(raw_output=False),
            role=fake.random_element(["admin", "agent", "viewer"]),
        )
        db.add(u)
        user_ids.append(u.id)

    # Messages
    for _ in range(messages):
        m = Message(
            id=uuid.uuid4(),
            tenant_id=tenant_id,
            sender_user_id=fake.random_element(user_ids),
            content_encrypted=fake.text(max_nb_chars=200).encode(),
            language=fake.random_element(["en", "fr"]),
        )
        db.add(m)

    db.commit()
    print(f"Seeded {users} users and {messages} messages with Faker")

if __name__ == "__main__":
    u = int(sys.argv[1]) if len(sys.argv) > 1 else 10
    m = int(sys.argv[2]) if len(sys.argv) > 2 else 100
    seed(u, m)
