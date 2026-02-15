from pydantic import BaseModel, Field
from typing import Literal, Optional
from datetime import datetime
from bson import ObjectId
from typing import Annotated, Any
from pydantic import BaseModel, Field, BeforeValidator, PlainSerializer, WithJsonSchema

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

class GameBase(BaseModel):
    word: str
    attempts: int
    status: Literal["win", "loss"]
    score: int

class GameCreate(GameBase):
    pass

class GameInDB(GameBase):
    id: Optional[PyObjectId] = Field(alias="_id")
    user_id: ObjectId
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class GameResponse(GameBase):
    id: str
    created_at: datetime
