from fastapi import APIRouter, Depends, HTTPException, status, Body
import requests
from app.core.config import settings
from app.db.mongodb import get_database
from app.models.user import UserCreate, UserResponse, UserInDB
from app.core.security import create_access_token
from datetime import timedelta
from app.api import deps
from bson import ObjectId

router = APIRouter()

@router.post("/google", response_model=dict)
async def google_auth(token: str = Body(..., embed=True)):
    try:
        # Verify access token by fetching user info
        response = requests.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        if response.status_code != 200:
            raise ValueError("Invalid access token")
            
        id_info = response.json()

        google_id = id_info['sub']
        email = id_info['email']
        name = id_info.get('name', '')
        picture = id_info.get('picture', '')
        
        db = await get_database()
        
        # Check if user exists
        user = await db.users.find_one({"google_id": google_id})
        
        if not user:
            # Create new user
            user_in = UserInDB(
                email=email,
                username=name or email.split('@')[0],
                avatar=picture,
                google_id=google_id
            )
            new_user = await db.users.insert_one(user_in.model_dump(by_alias=True, exclude={"id"}))
            user_id = str(new_user.inserted_id)
        else:
            user_id = str(user["_id"])
            # Update avatar if changed
            if user.get("avatar") != picture:
                await db.users.update_one({"_id": user["_id"]}, {"$set": {"avatar": picture}})

        # Create JWT
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            subject=user_id, expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "email": email,
                "username": name or email.split('@')[0], # Fallback
                "avatar": picture
            }
        }

    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token",
        )

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: UserResponse = Depends(deps.get_current_user)):
    return current_user
