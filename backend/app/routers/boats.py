from fastapi import APIRouter, HTTPException, Cookie, Depends
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from app.database import get_db
import app.models as models
import app.schemas as schemas
from app.cfg import SECRET_KEY, HASHING_ALGORITHM
from typing import List
from typing import Annotated
from app.routers.auth import get_current_user


boat_router = APIRouter(prefix="/boats")

@boat_router.get("/", response_model=List[schemas.Boat])
def get_all_boats(db: Session = Depends(get_db)):
    return db.query(models.Journey).filter(models.Journey.end_type == 0).all()

@boat_router.get('/get-user-journeys-with-boats/{user_id}', response_model=List[schemas.JourneyResponseModel])
def get_user_journeys_details(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.Journey).filter(models.Journey.user_id == user_id, models.Journey.end_type == 0).all()

@boat_router.get('/get-my-journeys-with-boats', response_model=List[schemas.JourneyResponseModel])
def get_all_journey(current_user: Annotated[schemas.User, Depends(get_current_user)], db: Session = Depends(get_db),):
    return db.query(models.Journey).filter(models.Journey.user_id == current_user.id, models.Journey.end_type == 0).all()
