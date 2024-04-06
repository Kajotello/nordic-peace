from fastapi import FastAPI
import app.models as models
from app.database import engine
from app.routers.users import user_router
from app.routers.ships import ship_router
from app.routers.journeys import journey_router
models.Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(user_router)
app.include_router(ship_router)
app.include_router(journey_router)
