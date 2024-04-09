from fastapi import APIRouter, HTTPException, Cookie, Depends
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from app.database import get_db
import app.models as models
import app.schemas as schemas
from app.cfg import SECRET_KEY, HASHING_ALGORITHM
import datetime
from typing import Annotated
from app.routers.auth import get_current_user

journey_router = APIRouter(prefix="/journeys")


MAP_STATUS_TO_TEXT = {
    0: "Ended Successfully",
    1: "Ended by user",
    2: "Ended by storm"
}


@journey_router.get("/", response_model=schemas.JourneyResponseModel)
def get_all_journeys(db: Session = Depends(get_db)):
    return db.query(models.Journey).all()


@journey_router.post("/create", response_model=schemas.JourneyResponseModel)
def create_journey(journey: schemas.Journey, current_user: Annotated[schemas.User, Depends(get_current_user)], db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == current_user.id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if journey.ship_tier not in range(5):
        raise HTTPException(status_code=400, detail="Ship tier has to be an integer between 0 and 4")
    
    if journey.duration < 0:
        raise HTTPException(status_code=400, detail="Duration cannot be negative")
    
    if journey.start_date - datetime.datetime.utcnow() > datetime.timedelta(days=3):
        experience = journey.duration * 3
    else:
        experience = journey.duration
    
    db_journey = models.Journey(user_id=current_user.id, ship_tier=journey.ship_tier, duration=journey.duration, start_date=journey.start_date, experience_to_get=experience)
    db.add(db_journey)
    db.commit()
    db.refresh(db_journey)
    return db_journey


@journey_router.post('/end_journey')
def end_journey(end_journey: schemas.EndJourney,
                current_user: Annotated[schemas.User, Depends(get_current_user)],
                db: Session = Depends(get_db)):
    
    if end_journey.end_type not in range(3):
        raise HTTPException(status_code=400, detail="Journey end-type has to be in range 0 and 2")
    journey = db.query(models.Journey).filter(models.Journey.id == end_journey.id, models.Journey.user_id == current_user.id).first()

    if end_journey.end_type == 0 and datetime.datetime.now(datetime.timezone.utc) < journey.start_date + datetime.timedelta(seconds=journey.duration-5):
        raise HTTPException(status_code=400, detail="Journey cannot be ended successfully before time")

    journey.end_type = end_journey.end_type
    # journey.end_time = datetime.datetime.now(datetime.timezone.utc)
    
    if end_journey.end_type == 0:
        current_user.experience += journey.experience_to_get
    
    db.commit()
    return JSONResponse(content={"message": f"Journey with id: '{end_journey.id}' has ended with status: '{MAP_STATUS_TO_TEXT[end_journey.end_type]}'",
                                  "experience": current_user.experience})



@journey_router.post("/{journey_id}")
def delete_journey(journey_id: int, db: Session = Depends(get_db)):
    db.query(models.Journey).filter(models.Journey.id == journey_id).delete()
    db.commit()
    return {"message": "Journey deleted successfully"}
