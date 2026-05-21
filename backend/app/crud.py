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
        deadline=application.deadline,
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

def update_application(db: Session, application_id: int, application: schemas.JobApplicationCreate):
    db_application = get_application(db, application_id)

    if db_application is None:
        return None

    db_application.company = application.company
    db_application.position = application.position
    db_application.status = application.status
    db_application.notes = application.notes
    db_application.data_applied = application.date_applied
    db_application.deadline = application.deadline

    db.commit()
    db.refresh(db_application)

    return db_application

