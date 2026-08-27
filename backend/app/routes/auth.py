from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Any
from slowapi import Limiter
from slowapi.util import get_remote_address
from jose import JWTError, jwt

from app import models, schemas, auth
from app.database import get_db
from app.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])
limiter = Limiter(key_func=get_remote_address)

MAX_FAILED_ATTEMPTS = 5
LOCKOUT_MINUTES = 15

def generate_tokens(email: str) -> dict:
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": email}, expires_delta=access_token_expires
    )
    refresh_token = auth.create_refresh_token(
        data={"sub": email}
    )
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

def verify_and_authenticate_user(email: str, password: str, db: Session) -> models.User:
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if user.locked_until and user.locked_until > datetime.utcnow():
        lockout_remaining = int((user.locked_until - datetime.utcnow()).total_seconds() / 60) + 1
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Account is locked due to multiple failed attempts. Try again in {lockout_remaining} minute(s)."
        )

    if not auth.verify_password(password, user.hashed_password):
        user.failed_login_attempts = (user.failed_login_attempts or 0) + 1
        if user.failed_login_attempts >= MAX_FAILED_ATTEMPTS:
            user.locked_until = datetime.utcnow() + timedelta(minutes=LOCKOUT_MINUTES)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Successful login: reset failed attempts & lockout
    if user.failed_login_attempts > 0 or user.locked_until is not None:
        user.failed_login_attempts = 0
        user.locked_until = None
        db.commit()

    return user

@router.post("/register", response_model=schemas.Token)
@limiter.limit("10/minute")
def register(request: Request, user: schemas.UserCreate, db: Session = Depends(get_db)) -> Any:
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return generate_tokens(new_user.email)

@router.post("/login", response_model=schemas.Token)
@limiter.limit("10/minute")
def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)) -> Any:
    user = verify_and_authenticate_user(form_data.username, form_data.password, db)
    return generate_tokens(user.email)

@router.post("/login-json", response_model=schemas.Token)
@limiter.limit("10/minute")
def login_json(request: Request, user_credentials: schemas.UserLogin, db: Session = Depends(get_db)) -> Any:
    user = verify_and_authenticate_user(user_credentials.email, user_credentials.password, db)
    return generate_tokens(user.email)

@router.post("/refresh", response_model=schemas.Token)
@limiter.limit("10/minute")
def refresh_token(request: Request, token_data: schemas.RefreshTokenRequest, db: Session = Depends(get_db)) -> Any:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired refresh token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token_data.refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        token_type: str = payload.get("type")
        if not email or token_type != "refresh":
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(models.User).filter(models.User.email == email).first()
    if not user or not user.is_active:
        raise credentials_exception

    return generate_tokens(user.email)

@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(auth.get_current_active_user)) -> Any:
    return current_user

@router.post("/logout")
def logout(current_user: models.User = Depends(auth.get_current_active_user)) -> Any:
    return {"message": "Logged out successfully"}

