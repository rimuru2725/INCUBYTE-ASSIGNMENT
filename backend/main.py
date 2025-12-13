from fastapi import FastAPI
from backend import models, database
from backend.routers import auth

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

app.include_router(auth.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Sweet Shop API"}
