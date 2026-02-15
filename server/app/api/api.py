from fastapi import APIRouter
from app.api.endpoints import auth, games, words, users

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(games.router, prefix="/games", tags=["games"])
api_router.include_router(words.router, prefix="/words", tags=["words"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
