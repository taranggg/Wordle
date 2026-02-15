from fastapi import APIRouter, Depends, HTTPException, Body
from typing import List, Any
from app.api import deps
from app.models.user import UserResponse
from app.models.game import GameCreate, GameResponse, GameInDB
from app.db.mongodb import get_database
from bson import ObjectId
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=GameResponse)
async def create_game(
    *,
    game_in: GameCreate,
    current_user: UserResponse = Depends(deps.get_current_user)
) -> Any:
    db = await get_database()
    
    game_data = GameInDB(
        **game_in.model_dump(),
        user_id=ObjectId(current_user.id),
        created_at=datetime.utcnow()
    )
    
    result = await db.games.insert_one(game_data.model_dump(by_alias=True, exclude={"id"}))
    
    # Update user stats? (Can be done here or calculated on fly)
    
    return GameResponse(
        **game_in.model_dump(),
        id=str(result.inserted_id),
        created_at=game_data.created_at
    )

@router.get("/history", response_model=List[GameResponse])
async def read_games_history(
    skip: int = 0,
    limit: int = 100,
    current_user: UserResponse = Depends(deps.get_current_user)
) -> Any:
    db = await get_database()
    cursor = db.games.find({"user_id": ObjectId(current_user.id)}).sort("created_at", -1).skip(skip).limit(limit)
    games = await cursor.to_list(length=limit)
    
    return [
        GameResponse(
            **game,
            id=str(game["_id"]),
            # user_id is in game but not needed in response if not requested, but GameResponse inherits GameBase which doesn't have it.
        ) for game in games
    ]
