from sqlalchemy.orm import Session
from . import models, schemas

def get_applications_by_user(db: Session, user_id: int):
    return db.query(models.JobApplication).filter(
        models.JobApplication.user_id == user_id
    ).all()

def get_application(db: Session, application_id: int, user_id: int):
    return db.query(models.JobApplication).filter(
        models.JobApplication.id == application_id,
        models.JobApplication.user_id == user_id
    ).first()

def create_application(db: Session, application: schemas.JobApplicationCreate, user_id: int):
    db_application = models.JobApplication(
        company=application.company,
        position=application.position,
        status=application.status,
        date_applied=application.date_applied,
        deadline=application.deadline,
        notes=application.notes,
        user_id = user_id
    )

    db.add(db_application)
    db.commit()
    db.refresh(db_application)

    return db_application

def delete_application(db: Session, application_id: int, user_id: int):
    db_application = get_application(db, application_id, user_id)

    if db_application:
        db.delete(db_application)
        db.commit()

    return db_application

def update_application(db: Session, application_id: int, application: schemas.JobApplicationCreate, user_id: int):
    db_application = get_application(db, application_id, user_id)

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

