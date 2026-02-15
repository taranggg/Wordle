from fastapi import APIRouter, Depends
from typing import List, Any
from app.db.mongodb import get_database
from app.models.user import UserResponse  # Leaderboard model needed?
# Reuse LeaderboardRow interface from frontend: rank, username, totalScore, wins, games
from pydantic import BaseModel

class LeaderboardRow(BaseModel):
    rank: int
    username: str
    totalScore: int
    wins: int
    games: int

router = APIRouter()

@router.get("/leaderboard", response_model=List[LeaderboardRow])
async def get_leaderboard(
    period: str = "all",
    limit: int = 10
) -> Any:
    # This is expensive aggregation on large data, but fine for small scale.
    db = await get_database()
    
    pipeline = [
        # Group by user_id
        {
            "$group": {
                "_id": "$user_id",
                "totalScore": {"$sum": "$score"},
                "games": {"$sum": 1},
                "wins": {
                    "$sum": {
                        "$cond": [{"$eq": ["$status", "win"]}, 1, 0]
                    }
                }
            }
        },
        # Sort by score descending
        {"$sort": {"totalScore": -1}},
        {"$limit": limit},
        # Join with users to get username
        {
            "$lookup": {
                "from": "users",
                "localField": "_id",
                "foreignField": "_id",
                "as": "user"
            }
        },
        {"$unwind": "$user"},
        # Project output
        {
            "$project": {
                "username": "$user.username",
                "totalScore": 1,
                "wins": 1,
                "games": 1
            }
        }
    ]
    
    results = await db.games.aggregate(pipeline).to_list(length=limit)
    
    leaderboard = []
    for i, res in enumerate(results):
        leaderboard.append(LeaderboardRow(
            rank=i + 1,
            username=res["username"],
            totalScore=res["totalScore"],
            wins=res["wins"],
            games=res["games"]
        ))
        
    return leaderboard
