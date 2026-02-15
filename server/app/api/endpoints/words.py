from fastapi import APIRouter, Depends
import random
from typing import Dict
from datetime import datetime

router = APIRouter()

# Keep it simple for now. In production, this should be in DB or a large file.
WORDS = [
    "APPLE", "BEACH", "BRAIN", "BREAD", "BRUSH", "CHAIR", "CHEST", "CHORD",
    "CLICK", "CLOCK", "CLOUD", "DANCE", "DIARY", "DRINK", "DRIVE", "EARTH",
    "FEAST", "FIELD", "FRUIT", "GLASS", "GRAPE", "GREEN", "GHOST", "HEART",
    "HOUSE", "JUICE", "LIGHT", "LEMON", "MELON", "MONEY", "MUSIC", "NIGHT",
    "OCEAN", "PARTY", "PIZZA", "PHONE", "PILOT", "PLANE", "PLATE", "RADIO",
    "RIVER", "ROBOT", "SHIRT", "SHOES", "SMILE", "SNAKE", "SPACE", "SPOON",
    "STORM", "TABLE", "TOAST", "TIGER", "TOUCH", "TRAIN", "TRUCK", "VOICE",
    "WATCH", "WATER", "WHALE", "WORLD", "WRITE", "YOUTH", "ZEBRA"
]

@router.get("/daily", response_model=Dict[str, str])
async def get_daily_word():
    # Deterministic word based on date
    today = datetime.now().date()
    # Simple hash of date to pick an index
    day_seed = today.toordinal()
    index = day_seed % len(WORDS)
    word = WORDS[index]
    return {
        "word": word,
        "date": today.isoformat()
    }

@router.get("/random", response_model=Dict[str, str])
async def get_random_word():
    word = random.choice(WORDS)
    return {"word": word}
