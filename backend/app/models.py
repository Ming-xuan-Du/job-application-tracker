from sqlalchemy import Column, Integer, String
from .database import Base

class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(Integer, primary_key=True, index=True)
    company = Column(String, index=True)
    position = Column(String)
    status = Column(String)
    date_applied = Column(String)
    notes = Column(String, nullable=True)