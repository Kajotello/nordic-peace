from fastapi import APIRouter, HTTPException, Response
from fastapi.responses import RedirectResponse
from fastapi import FastAPI, Depends, Request, Cookie
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.schemas import Jwt
from app.models import User
from app.database import get_db
import requests
from jose import jwt
from dotenv import load_dotenv
import os
from typing import Annotated
from app.cfg import ACCESS_TOKEN_EXPIRE_MINUTES, HASHING_ALGORITHM, SECRET_KEY
from passlib.context import CryptContext
from datetime import timedelta, datetime, timezone

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
auth_router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
from jose import JWTError, jwt

load_dotenv()
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = "http://127.0.0.1:8080/google-auth"
SCOPE = "https://www.googleapis.com/auth/calendar"


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: Annotated[Session, Depends(get_db)]):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[HASHING_ALGORITHM])
        username: str = payload.get("user_nick")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.nick == username).first()
    if user is None:
        raise credentials_exception
    return user


def authenticate_user(username: str, password: str, db):
    user = db.query(User).filter(User.nick == username).first()
    if not user:
        return False
    if not pwd_context.verify(password, user.hash_password):
        return False
    return user


def create_access_token(data: dict, expires_delta):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=HASHING_ALGORITHM)
    return encoded_jwt


@auth_router.post("/register")
def register(form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
             response: Response,
             db: Session = Depends(get_db)) -> Jwt:
    hashed_password = pwd_context.hash(form_data.password)

    nick_exists = db.query(User).filter(User.nick == form_data.username).first()
    if nick_exists is not None:
        raise HTTPException(status_code=409, detail=f"User with nick: '{form_data.username}' already exists")
    
    db_user = User(nick=form_data.username, hash_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"user_nick": db_user.nick, "user_id": db_user.id}, expires_delta=access_token_expires
    )
    response.set_cookie(key='jwt_cookie', value=access_token)
    return Jwt(jwt=access_token)


@auth_router.post("/login")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    response: Response,
    db: Session = Depends(get_db)
) -> Jwt:
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"user_nick": user.nick, "user_id": user.id}, expires_delta=access_token_expires
    )
    response.set_cookie(key='jwt_cookie', value=access_token)
    return Jwt(jwt=access_token)


@auth_router.get("/login/google/")
async def login_google(jwt_cookie: str = Cookie()):
    res = RedirectResponse(
        f"https://accounts.google.com/o/oauth2/auth?response_type=code&client_id={GOOGLE_CLIENT_ID}&redirect_uri={GOOGLE_REDIRECT_URI}&scope={SCOPE}")
    res.set_cookie(key="jwt", value=jwt_cookie)
    return res
    # return {
    #     "url": f"https://accounts.google.com/o/oauth2/auth?response_type=code&client_id={GOOGLE_CLIENT_ID}&redirect_uri={GOOGLE_REDIRECT_URI}&scope={SCOPE}"
    # }


def get_dummy_event(year=2024, month=4, day=28):
    if month < 10:
        month = f"0{month}"
    if day < 10:
        day = f"0{day}"
    event = {
        'summary': 'event from api',
        'start': {
            'dateTime': f'{year}-{month}-{day}T09:00:00-07:00',
            'timeZone': 'America/Los_Angeles',
        },
        'end': {
            'dateTime': f'{year}-{month}-{day}T17:00:00-07:00',
            'timeZone': 'America/Los_Angeles',
        },
        'reminders': {
            'useDefault': False,
            'overrides': [
                {'method': 'popup', 'minutes': 10},
            ],
        },
    }
    return event

def create_event(access_token: str):
    # craete event
    event_creation_url = "https://www.googleapis.com/calendar/v3/calendars/primary/events"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
    response = requests.post(event_creation_url, headers=headers, json=get_dummy_event(day=10))


@auth_router.get("/google-auth")
async def auth_google(code: str, request: Request):
    jwt_token = request.cookies.get("jwt")
    token_url = "https://accounts.google.com/o/oauth2/token"
    data = {
        "code": code,
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "grant_type": "authorization_code",
    }
    response = requests.post(token_url, data=data)
    access_token = response.json().get("access_token")
    # save in redis     jwt: access_token
    redis = {}
    redis[jwt_token] = access_token


    res = RedirectResponse("http://172.98.2.193:3000/app")
    return res

@auth_router.get("/token/")
async def get_token(token: str = Depends(oauth2_scheme)):
    return jwt.decode(token, GOOGLE_CLIENT_SECRET, algorithms=["HS256"])
