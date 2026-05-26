from pydantic import BaseModel
from typing import Optional

class JobApplicationBase(BaseModel):
    company: str
    position: str
    status: str
    date_applied: str
    deadline: Optional[str] = None
    notes: Optional[str] = None

class JobApplicationCreate(JobApplicationBase):
    pass

class JobApplication(JobApplicationBase):
    id: int

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str