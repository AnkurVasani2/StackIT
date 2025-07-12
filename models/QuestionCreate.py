from pydantic import BaseModel, Field
from typing import List

class QuestionCreateModel(BaseModel):
    title: str = Field(..., min_length=5, max_length=200)
    description: str = Field(..., min_length=10)
    tags: List[str] = Field(default_factory=list, min_items=1, max_items=5)

    class Config:
        json_schema_extra = {
            "example": {
                "title": "How to implement FastAPI with MySQL?",
                "description": "I need help implementing FastAPI with MySQL database connection",
                "tags": ["python", "fastapi", "mysql"]
            }
        }