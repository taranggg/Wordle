from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId
from typing import Annotated, Any
from pydantic import BaseModel, EmailStr, Field, BeforeValidator, PlainSerializer, WithJsonSchema

def validate_object_id(v: Any) -> ObjectId:
    if isinstance(v, ObjectId):
        return v
    if ObjectId.is_valid(v):
        return ObjectId(v)
    raise ValueError("Invalid ObjectId")

PyObjectId = Annotated[
    ObjectId,
    BeforeValidator(validate_object_id),
    PlainSerializer(lambda x: str(x), return_type=str),
    WithJsonSchema({"type": "string"}, mode='serialization'),
]

class UserBase(BaseModel):
    email: EmailStr
    username: str
    avatar: Optional[str] = None

class UserCreate(UserBase):
    google_id: str

class UserInDB(UserBase):
    id: Optional[PyObjectId] = Field(alias="_id")
    google_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class UserResponse(UserBase):
    id: str

    class Config:
        from_attributes = True
