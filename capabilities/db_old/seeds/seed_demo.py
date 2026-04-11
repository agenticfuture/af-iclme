
import uuid, sys
from db.session import SessionLocal
from db.models.core import User
from db.models.conversation import Message

def seed(users=5, messages=20):
    db = SessionLocal()
    tenant_id = uuid.uuid4()

    user_ids = []
    for i in range(users):
        u = User(
            id=uuid.uuid4(),
            tenant_id=tenant_id,
            external_id=f"kc-{i}",
            email_hash=f"hash-{i}",
            role="agent"
        )
        db.add(u)
        user_ids.append(u.id)

    for i in range(messages):
        m = Message(
            id=uuid.uuid4(),
            tenant_id=tenant_id,
            sender_user_id=user_ids[i % len(user_ids)],
            content_encrypted=b"encrypted",
            language="en"
        )
        db.add(m)

    db.commit()
    print(f"Seeded {users} users and {messages} messages")

if __name__ == "__main__":
    u = int(sys.argv[1]) if len(sys.argv) > 1 else 5
    m = int(sys.argv[2]) if len(sys.argv) > 2 else 20
    seed(u, m)
