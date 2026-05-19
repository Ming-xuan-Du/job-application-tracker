from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from . import models, schemas, crud
from .database import engine, SessionLocal

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Job Application Tracker API is running"}

@app.get("/applications", response_model=List[schemas.JobApplication])
def read_applications(db: Session = Depends(get_db)):
    return crud.get_applications(db)

@app.post("/applications", response_model=schemas.JobApplication)
def create_application(
    application: schemas.JobApplicationCreate,
    db: Session = Depends(get_db)
):
    return crud.create_application(db, application)

@app.get("/applications/{application_id}", response_model=schemas.JobApplication)
def read_application(
    application_id: int,
    db: Session = Depends(get_db)
):
    application = crud.get_application(db, application_id)

    if application is None:
        raise HTTPException(status_code=404, detail="Application not found")

    return application

@app.delete("/applications/{application_id}")
def delete_application(
    application_id: int,
    db: Session = Depends(get_db)
):
    application = crud.delete_application(db, application_id)

    if application is None:
        raise HTTPException(status_code=404, detail="Application not found")

    return {"message": "Application deleted successfully"}