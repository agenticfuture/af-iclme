
import uuid
from sqlalchemy import create_engine, text

DATABASE_URL = "postgresql://user:password@localhost/icmle"

engine = create_engine(DATABASE_URL)

def seed():
    with engine.begin() as conn:

        # Seed domains
        domains = [
            "business", "product", "infrastructure", "security",
            "compliance", "marketing", "finance", "governance",
            "data", "AI", "UX", "operations"
        ]

        for d in domains:
            conn.execute(text("""
                INSERT INTO domains (id, name)
                VALUES (:id, :name)
                ON CONFLICT (name) DO NOTHING
            """), {"id": uuid.uuid4(), "name": d})

        # Seed idea types
        types = [
            "policy", "instruction", "question", "requirement",
            "feature", "bug", "experiment", "governance_update",
            "security_patch", "compliance_change",
            "marketing_campaign", "pricing_change",
            "infra_change", "documentation_update"
        ]

        for t in types:
            conn.execute(text("""
                INSERT INTO idea_types (id, name)
                VALUES (:id, :name)
                ON CONFLICT (name) DO NOTHING
            """), {"id": uuid.uuid4(), "name": t})

        # Seed sample project
        project_id = uuid.uuid4()

        conn.execute(text("""
            INSERT INTO projects (id, project_key, name, project_type)
            VALUES (:id, 'SG-001', 'ServiceGen Core', 'startup')
            ON CONFLICT (project_key) DO NOTHING
        """), {"id": project_id})

if __name__ == "__main__":
    seed()
