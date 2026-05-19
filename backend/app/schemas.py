from pydantic import BaseModel
from typing import Optional

class JobApplicationBase(BaseModel):
    company: str
    position: str
    status: str
    date_applied: str
    notes: Optional[str] = None

class JobApplicationCreate(JobApplicationBase):
    pass

class JobApplication(JobApplicationBase):
    id: int

    class Config:
        from_attributes = True