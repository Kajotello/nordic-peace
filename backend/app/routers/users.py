from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app import schemas as schemas, models as models
from app.database import get_db
from auth import get_current_user
from typing import Annotated


user_router = APIRouter(prefix="/users")


def get_user_id_by_nick(user_nick: str, db):
    user = db.query(models.User).filter(models.User.nick == user_nick).first()
    return user.id


@user_router.get("/", response_model=list[schemas.User])
def read_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()


@user_router.get("/user-data", response_model=schemas.User)
def read_user(current_user: Annotated[schemas.User, Depends(get_current_user)]):
    return current_user


@user_router.post("/follow_user", response_model=schemas.Friends)
def follow_user(
    user_to_be_followed: schemas.AddFriend,
    current_user: Annotated[schemas.User, Depends(get_current_user)],
    db: Session = Depends(get_db)):

    if current_user.nick == user_to_be_followed.followed_user_nick:
        raise HTTPException(status_code=400, error_code=1, detail="Cannot follow self")

    check_if_followed_exists = db.query(models.User).filter(models.User.nick == user_to_be_followed.followed_user_nick).first()
    if not check_if_followed_exists:
        raise HTTPException(status_code=400, error_code=2, detail="User you are trying to follow doesn't exist")
    
    followed_id = get_user_id_by_nick(user_to_be_followed.followed_user_nick, db)
    
    followed_already = db.query(models.FollowedFriends).filter(models.FollowedFriends.followed_user_id == followed_id, models.FollowedFriends.following_user_id == user_id).first()
    if followed_already:
        raise HTTPException(status_code=400, error_code=3, detail="You are already following this user")

    friends = models.FollowedFriends(following_user_id=current_user.id, followed_user_id=followed_id)
    db.add(friends)
    db.commit()
    db.refresh(friends)
    return friends


@user_router.get("/list_followed", response_model=list[schemas.User])
def list_followed_users(current_user: Annotated[schemas.User, Depends(get_current_user)], db: Session = Depends(get_db)):
    followed = db.query(models.FollowedFriends).filter(models.FollowedFriends.following_user_id == current_user.id).all()
    ids_of_followed_users = set([follower.followed_user_id for follower in followed])    
    return [db.query(models.User).filter(models.User.id == id_of_followed_user).first() for id_of_followed_user in ids_of_followed_users]


@user_router.get("/list_following", response_model=list[schemas.User])
def list_following_users(current_user: Annotated[schemas.User, Depends(get_current_user)], db: Session = Depends(get_db)):
    followers = db.query(models.FollowedFriends).filter(models.FollowedFriends.followed_user_id == current_user.id).all()
    ids_of_followers = set([follower.following_user_id for follower in followers])
    return [db.query(models.User).filter(models.User.id == id_of_follower).first() for id_of_follower in ids_of_followers]


# @user_router.post("/grant_experience")
# def grant_experience(experience: schemas.UserExperience, jwt_cookie: str = Cookie(), db: Session = Depends(get_db)):
#     decoded_jwt = jwt.decode(jwt_cookie, SECRET_KEY, algorithms=[HASHING_ALGORITHM])
#     user_id = decoded_jwt.get('user_id')
#     user = db.query(models.User).filter(models.User.id == user_id).first()
    
#     if user.experience < 0:
#         raise HTTPException(status_code=400, detail="Cannot grant negative experience")

#     user.experience += experience.experience
#     db.commit()
#     return JSONResponse(content={"message": f"User with id: {user_id} had been granted: {experience.experience} experience and now has total: {user.experience}"})


# @user_router.post("/buy_premium")
# def buy_premium(jwt_cookie: str = Cookie(), db: Session = Depends(get_db)):
#     decoded_jwt = jwt.decode(jwt_cookie, SECRET_KEY, algorithms=[HASHING_ALGORITHM])
#     user_id = decoded_jwt.get('user_id')
#     found_user = db.query(models.User).filter(models.User.id == user_id).first()
#     if found_user.is_premium:
#         return JSONResponse(content={"message": f"User with id: {user_id} is already premium"})
#     found_user.is_premium = True
#     db.commit()
#     return JSONResponse(content={"message": f"User with id: {user_id} is now premium"})



# @user_router.get("/scoreboard/")
# def get_scoreboard(db: Session = Depends(get_db)):
#     users = db.query(models.User).all()
#     output_raw = [{"user_id": user.id, "experience": user.experience} for user in users]
#     return sorted(output_raw, key=lambda x: x.get('experience'), reverse=True)
