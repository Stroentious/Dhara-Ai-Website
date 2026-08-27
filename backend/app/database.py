from sqlalchemy import create_engine, event
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.exc import SQLAlchemyError
import logging
import os
from app.config import settings

logger = logging.getLogger(__name__)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def create_db_engine():
    db_url = settings.DATABASE_URL
    if db_url.startswith("postgresql"):
        try:
            # Quick check if PostgreSQL server is accepting connections
            test_engine = create_engine(db_url, connect_args={"connect_timeout": 2})
            conn = test_engine.connect()
            conn.close()
            test_engine.dispose()
            logger.info("Successfully connected to PostgreSQL database.")
            return create_engine(db_url, pool_pre_ping=True)
        except Exception as e:
            logger.warning(f"PostgreSQL server not reachable ({e}). Falling back to local SQLite database.")
            db_path = os.path.join(BASE_DIR, "dharaai_local.db")
            db_url = f"sqlite:///{db_path}"
    elif db_url.startswith("sqlite:///./"):
        relative_file = db_url.replace("sqlite:///./", "")
        abs_file = os.path.join(BASE_DIR, relative_file)
        db_url = f"sqlite:///{abs_file}"

    # SQLite configuration
    eng = create_engine(db_url, connect_args={"check_same_thread": False})
    
    @event.listens_for(eng, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.close()
        
    return eng


engine = create_db_engine()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    except SQLAlchemyError as e:
        logger.error(f"Database error: {e}")
        db.rollback()
        raise
    finally:
        db.close()
