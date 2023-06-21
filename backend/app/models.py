from sqlalchemy import Column, create_engine
from config import SQLALCHEMY_DATABASE_URI
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import String, TIMESTAMP
from sqlalchemy.dialects.mysql import BIGINT, INTEGER

engine = create_engine(SQLALCHEMY_DATABASE_URI, pool_size=20,
                       max_overflow=0, pool_pre_ping=True)
db = scoped_session(sessionmaker(bind=engine))
Base = declarative_base()
Base.query = db.query_property()


class User(Base):
    """User table containing login information of the user."""

    __tablename__ = 'user'

    id = Column(BIGINT(20), primary_key=True)
    first_name = Column(String(255, 'utf8mb4_unicode_ci'), nullable=False)
    last_name = Column(String(255, 'utf8mb4_unicode_ci'), nullable=False)
    email = Column(String(255, 'utf8mb4_unicode_ci'),
                   nullable=False, unique=True)
    password = Column(String(255, 'utf8mb4_unicode_ci'))
    created_at = Column(TIMESTAMP)


class Bills(Base):
    """Bills table keeping the record of bills uploaded."""

    __tablename__ = 'bills'

    id = Column(BIGINT(20), primary_key=True)
    first_name = Column(String(255, 'utf8mb4_unicode_ci'), nullable=False)
    last_name = Column(String(255, 'utf8mb4_unicode_ci'), nullable=False)
    address = Column(String(255, 'utf8mb4_unicode_ci'), nullable=False)
    hospital_name = Column(String(255, 'utf8mb4_unicode_ci'), nullable=False)
    amount = Column(INTEGER)
    service_date = Column(TIMESTAMP)
    bill_image = Column(String(255, 'utf8mb4_unicode_ci'))
