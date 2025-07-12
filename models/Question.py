from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class VoteModel(BaseModel):
    likes: int = 0
    dislikes: int = 0

class TagModel(BaseModel):
    tag_id: int
    name: str
    description: Optional[str] = None

class CommentModel(BaseModel):
    comment_id: int
    user_id: int
    username: str
    comment_text: str
    created_at: datetime

class AnswerModel(BaseModel):
    answer_id: int
    user_id: int
    username: str
    title: Optional[str]
    description: str
    votes: VoteModel
    created_at: datetime
    updated_at: datetime
    comments: List[CommentModel]

class QuestionModel(BaseModel):
    question_id: int
    user_id: int
    username: str
    title: str
    description: Optional[str]
    votes: VoteModel
    created_at: datetime
    updated_at: datetime
    tags: List[TagModel]
    answers: List[AnswerModel]
    answer_count: int