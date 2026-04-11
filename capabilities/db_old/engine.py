
import os
from dotenv import load_dotenv

env = os.getenv("APP_ENV", "local")


# from sqlalchemy import create_engine
# engine = create_engine("postgresql+psycopg2://servicegen:servicegen@localhost:5432/servicegen")

DATABASE_URL = (
    f"postgresql+psycopg2://{os.environ['POSTGRES_USER']}:"
    f"{os.environ['POSTGRES_PASSWORD']}@"
    f"{os.environ['POSTGRES_HOST']}:{os.environ['POSTGRES_PORT']}/"
    f"{os.environ['POSTGRES_DB']}"
)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10 if env != "local" else 5,
    max_overflow=20 if env == "prod" else 5,
)