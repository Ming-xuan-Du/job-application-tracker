from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from . import models, schemas, crud
from .database import engine, SessionLocal

SECRET_KEY = "your-secret-key-for-development"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes = ["bcrypt"], deprecated = "auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl = "/login")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes = ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm = ALGORITHM)
    return encoded_jwt

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()

@app.post("/register")
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()

    if existing_user:
        raise HTTPException(status_code = 400, detail = "Email already registered")
    
    hashed_password = hash_password(user.password)

    new_user = models.User(
        email = user.email,
        hashed_password = hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "user_id": new_user.id,
        "email": new_user.email
    }

@app.post("/login", response_model = schemas.Token)
def login_user(
    from_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    db_user = db.query(models.User).filter(models.User.email == from_data.username).first()

    if not db_user:
        raise HTTPException(status_code = 401, detail = "Invalid email or password")
    
    if not verify_password(from_data.password, db_user.hashed_password):
        raise HTTPException(status_code = 401, detail = "Invalid email or password")
    
    access_token = create_access_token(data = {"sub": db_user.email})

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

def get_current_user(
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code = status.HTTP_401_UNAUTHORIZED,
        detail = "Could not validate credentials",
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms = [ALGORITHM])
        email: str = payload.get("sub")

        if email is None:
            raise credentials_exception
        
    except JWTError:
        raise credentials_exception
    
    user = db.query(models.User).filter(models.User.email == email).first()

    if user is None:
        raise credentials_exception

    return user

@app.get("/")
def read_root():
    return {"message": "Job Application Tracker API is running"}

@app.get("/applications", response_model=List[schemas.JobApplication])
def read_applications(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.get_applications_by_user(db, current_user.id)

@app.post("/applications", response_model=schemas.JobApplication)
def create_application(
    application: schemas.JobApplicationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.create_application(db, application, current_user.id)

@app.get("/applications/{application_id}", response_model=schemas.JobApplication)
def read_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_application = crud.get_application(db, application_id, current_user.id)

    if db_application is None:
        raise HTTPException(status_code=404, detail="Application not found")

    return db_application

@app.delete("/applications/{application_id}")
def delete_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_application = crud.delete_application(db, application_id, current_user.id)

    if db_application is None:
        raise HTTPException(status_code=404, detail="Application not found")

    return {"message": "Application deleted successfully"}

@app.put("/applications/{application_id}", response_model=schemas.JobApplication)
def update_application(
    application_id: int,
    application: schemas.JobApplicationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_application = crud.update_application(db, application_id, application, current_user.id)

    if db_application is None:
        raise HTTPException(status_code=404, detail="Applicatioin not found")
    
    return db_application