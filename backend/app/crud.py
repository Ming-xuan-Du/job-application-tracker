from sqlalchemy.orm import Session
from . import models, schemas

def get_applications(db: Session):
    return db.query(models.JobApplication).all()

def get_application(db: Session, application_id: int):
    return db.query(models.JobApplication).filter(
        models.JobApplication.id == application_id
    ).first()

def create_application(db: Session, application: schemas.JobApplicationCreate):
    db_application = models.JobApplication(
        company=application.company,
        position=application.position,
        status=application.status,
        date_applied=application.date_applied,
        notes=application.notes
    )

    db.add(db_application)
    db.commit()
    db.refresh(db_application)

    return db_application

def delete_application(db: Session, application_id: int):
    db_application = get_application(db, application_id)

    if db_application:
        db.delete(db_application)
        db.commit()

    return db_application