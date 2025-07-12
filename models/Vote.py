from pydantic import BaseModel, Field
from enum import Enum

class VoteType(str, Enum):
    QUESTION = "question"
    ANSWER = "answer"

class VoteAction(str, Enum):
    LIKE = "like"
    DISLIKE = "dislike"

class VoteModel(BaseModel):
    type: VoteType
    id: int
    action: VoteAction
    user_id: int = Field(..., description="ID of the user making the vote")

    class Config:
        json_schema_extra = {
            "example": {
                "type": "question",
                "id": 15,
                "action": "like",
                "user_id": 420188
            }
        }