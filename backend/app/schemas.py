from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# For journey

class Journey(BaseModel):
    duration: int
    ship_tier: int
    start_date: datetime = datetime.now()

class EndJourney(BaseModel):
    id: int
    end_type: int

class JourneyResponseModel(BaseModel):
    id: int
    user_id: int
    ship_tier: int
    duration: int
    start_date: datetime
    end_date: datetime
    experience_to_get: int
    end_type: int = 0

    class Config:
        orm_mode = True


# For users

class UserBase(BaseModel):
    nick: str
    is_premium: Optional[bool] = False
    experience: Optional[int] = 0
    
class AuthUser(BaseModel):
    nick: str
    password: str

class UserId(BaseModel):
    user_id: int

class UserExperience(BaseModel):
    experience: int

class User(UserBase):
    id: int
    class Config:
        orm_mode = True



# For friends

class AddFriend(BaseModel):
    followed_user_nick: str

class Friends(BaseModel):
    id: int
    following_user_id: int
    followed_user_id: int
    class Config:
        orm_mode = True


# Score board

class ScoreboardItem(BaseModel):
    user_id: int
    experience: int
    
    class Config:
        orm_mode = True

# Tokens

class Jwt(BaseModel):
    jwt: str
