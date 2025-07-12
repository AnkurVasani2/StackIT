from pydantic import BaseModel, Field

class AnswerCreateModel(BaseModel):
    question_id: int
    user_id: int
    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=10)

    class Config:
        json_schema_extra = {
            "example": {
                "question_id": 1,
                "user_id": 12345,
                "title": "How to implement FastAPI with MySQL",
                "description": "Here's how you can implement FastAPI with MySQL..."
            }
        }