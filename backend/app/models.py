from sqlalchemy import Column, ForeignKey, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.database import Base
import datetime

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    nick = Column(String, index=True, unique=True)
    hash_password = Column(String)
    is_premium = Column(Boolean, default=False)
    experience = Column(Integer, default=0)

class FollowedFriends(Base):
    __tablename__ = 'followed_friends'
    id = Column(Integer, primary_key=True, index=True)
    following_user_id = Column(Integer, ForeignKey('users.id'))
    followed_user_id = Column(Integer, ForeignKey('users.id'))

class Journey(Base):
    __tablename__ = 'journeys'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    ship_tier = Column(Integer)
    duration = Column(Integer)
    start_date = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc))
    # end_date = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc))
    end_type = Column(Integer, default=0)
    experience_to_get = Column(Integer, default=0)

