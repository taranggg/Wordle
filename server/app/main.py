from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.api import api_router

app = FastAPI(title="Wordle API")

# CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5000",
    "http://127.0.0.1:5000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.on_event("startup")
async def startup_db_client():
    from app.db.mongodb import connect_to_mongo
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    from app.db.mongodb import close_mongo_connection
    await close_mongo_connection()

@app.get("/")
def read_root():
    return {"message": "Wordle API is running"}
