from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import logging
from .config import settings

logger = logging.getLogger(__name__)

# Try connecting to PostgreSQL. Fallback to SQLite for standalone local testing.
try:
    engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
    # Test connection
    with engine.connect() as conn:
        pass
    logger.info("Successfully connected to primary PostgreSQL database.")
except Exception as e:
    logger.warning(f"Could not connect to PostgreSQL. Falling back to local SQLite database. Reason: {e}")
    engine = create_engine("sqlite:///./thermos_local.db", connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
