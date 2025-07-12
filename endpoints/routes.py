from fastapi import APIRouter, HTTPException
from typing import List
from models.Question import QuestionModel
from models.AnswerCreate import AnswerCreateModel
from config.database import get_db_connection
from datetime import datetime
from fastapi.responses import JSONResponse

router = APIRouter()


def serialize_datetime(obj):
    """Helper function to serialize datetime objects"""
    if isinstance(obj, datetime):
        return obj.isoformat()
    return obj


def process_question(question):
    """Helper function to process question data and handle datetime serialization"""
    def process_dict(item):
        """Process dictionary items recursively"""
        if not isinstance(item, dict):
            return item
            
        processed = {}
        for key, value in item.items():
            if isinstance(value, datetime):
                processed[key] = value.isoformat()
            elif isinstance(value, list):
                processed[key] = [process_dict(v) if isinstance(v, dict) else v for v in value]
            elif isinstance(value, dict):
                processed[key] = process_dict(value)
            else:
                processed[key] = value
        return processed

    if not question:
        return None

    # Process the entire question dictionary
    processed_question = process_dict(question)
    
    # Process votes
    processed_question['votes'] = {
        'likes': int(processed_question.pop('likes', 0) or 0),
        'dislikes': int(processed_question.pop('dislikes', 0) or 0)
    }

    # Process answers and their votes
    for answer in processed_question.get('answers', []):
        answer['votes'] = {
            'likes': int(answer.pop('likes', 0) or 0),
            'dislikes': int(answer.pop('dislikes', 0) or 0)
        }

    return processed_question


@router.get("/questions/{question_id}", response_model=QuestionModel)
async def get_question_details(question_id: int):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        try:
            # Get question with user details and vote counts
            cursor.execute("""
                SELECT 
                    q.*,
                    u.username,
                    COALESCE(
                        (SELECT SUM(likes) FROM question_votes WHERE question_id = q.question_id),
                        0
                    ) as likes,
                    COALESCE(
                        (SELECT SUM(dislikes) FROM question_votes WHERE question_id = q.question_id),
                        0
                    ) as dislikes
                FROM questions q
                LEFT JOIN users u ON q.user_id = u.user_id
                WHERE q.question_id = %s
            """, (question_id,))

            question = cursor.fetchone()
            if not question:
                raise HTTPException(status_code=404, detail="Question not found")

            # Get tags
            cursor.execute("""
                SELECT t.*
                FROM tags t
                JOIN question_tags qt ON t.tag_id = qt.tag_id
                WHERE qt.question_id = %s
            """, (question_id,))
            question['tags'] = cursor.fetchall() or []

            # Get answers with votes and user details
            cursor.execute("""
                SELECT DISTINCT
                    a.*,
                    u.username,
                    COALESCE(
                        (SELECT SUM(likes) FROM answer_votes WHERE answer_id = a.answer_id),
                        0
                    ) as likes,
                    COALESCE(
                        (SELECT SUM(dislikes) FROM answer_votes WHERE answer_id = a.answer_id),
                        0
                    ) as dislikes
                FROM answers a
                LEFT JOIN users u ON a.user_id = u.user_id
                WHERE a.question_id = %s
                ORDER BY a.created_at DESC
            """, (question_id,))
            answers = cursor.fetchall() or []

            # Get comments for each answer
            for answer in answers:
                cursor.execute("""
                    SELECT 
                        c.*,
                        u.username
                    FROM comments c
                    JOIN users u ON c.user_id = u.user_id
                    WHERE c.answer_id = %s
                """, (answer['answer_id'],))
                answer['comments'] = cursor.fetchall() or []
                answer['votes'] = {
                    'likes': int(answer.pop('likes', 0) or 0),
                    'dislikes': int(answer.pop('dislikes', 0) or 0)
                }

            question['answers'] = answers
            processed_question = process_question(question)
            return JSONResponse(content=processed_question)

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

        finally:
            cursor.close()
            conn.close()

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/all_questions")
async def get_all_questions_details():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        try:
            # Get all questions with user details and vote counts
            cursor.execute("""
                SELECT 
                    q.*,
                    u.username,
                    COALESCE(
                        (SELECT SUM(likes) FROM question_votes WHERE question_id = q.question_id),
                        0
                    ) as likes,
                    COALESCE(
                        (SELECT SUM(dislikes) FROM question_votes WHERE question_id = q.question_id),
                        0
                    ) as dislikes
                FROM questions q
                LEFT JOIN users u ON q.user_id = u.user_id
                ORDER BY q.created_at DESC
            """)

            questions = cursor.fetchall()
            result = []

            for question in questions:
                # Get tags for each question
                cursor.execute("""
                    SELECT t.*
                    FROM tags t
                    JOIN question_tags qt ON t.tag_id = qt.tag_id
                    WHERE qt.question_id = %s
                """, (question['question_id'],))
                question['tags'] = cursor.fetchall() or []

                # Get answers with votes and user details
                cursor.execute("""
                    SELECT DISTINCT
                        a.*,
                        u.username,
                        COALESCE(
                            (SELECT SUM(likes) FROM answer_votes WHERE answer_id = a.answer_id),
                            0
                        ) as likes,
                        COALESCE(
                            (SELECT SUM(dislikes) FROM answer_votes WHERE answer_id = a.answer_id),
                            0
                        ) as dislikes
                    FROM answers a
                    LEFT JOIN users u ON a.user_id = u.user_id
                    WHERE a.question_id = %s
                    ORDER BY a.created_at DESC
                """, (question['question_id'],))
                answers = cursor.fetchall() or []

                # Get comments for each answer
                for answer in answers:
                    cursor.execute("""
                        SELECT 
                            c.*,
                            u.username
                        FROM comments c
                        JOIN users u ON c.user_id = u.user_id
                        WHERE c.answer_id = %s
                        ORDER BY c.created_at ASC
                    """, (answer['answer_id'],))
                    answer['comments'] = cursor.fetchall() or []
                    answer['votes'] = {
                        'likes': int(answer.pop('likes', 0) or 0),
                        'dislikes': int(answer.pop('dislikes', 0) or 0)
                    }

                question['answers'] = answers
                processed_question = process_question(question)
                result.append(processed_question)

            return JSONResponse(content={"questions": result})

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

        finally:
            cursor.close()
            conn.close()

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/answers/add")
async def add_answer(answer: AnswerCreateModel):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        try:
            # Start transaction
            conn.start_transaction()

            # Verify question exists
            cursor.execute("""
                SELECT question_id FROM questions 
                WHERE question_id = %s
            """, (answer.question_id,))
            
            if not cursor.fetchone():
                raise HTTPException(status_code=404, detail="Question not found")

            # Verify user exists
            cursor.execute("""
                SELECT user_id FROM users 
                WHERE user_id = %s
            """, (answer.user_id,))
            
            if not cursor.fetchone():
                raise HTTPException(status_code=404, detail="User not found")

            # Insert answer
            cursor.execute("""
                INSERT INTO answers 
                (question_id, user_id, title, description)
                VALUES (%s, %s, %s, %s)
            """, (
                answer.question_id,
                answer.user_id,
                answer.title,
                answer.description
            ))
            
            answer_id = cursor.lastrowid

            # Update answer count in questions table
            cursor.execute("""
                UPDATE questions 
                SET answer_count = COALESCE(answer_count, 0) + 1
                WHERE question_id = %s
            """, (answer.question_id,))

            # Commit transaction
            conn.commit()

            # Get the created answer with all details
            cursor.execute("""
                SELECT 
                    a.*,
                    u.username,
                    COALESCE(
                        (SELECT COUNT(*) FROM answer_votes WHERE answer_id = a.answer_id AND likes = 1),
                        0
                    ) as likes,
                    COALESCE(
                        (SELECT COUNT(*) FROM answer_votes WHERE answer_id = a.answer_id AND dislikes = 1),
                        0
                    ) as dislikes
                FROM answers a
                LEFT JOIN users u ON a.user_id = u.user_id
                WHERE a.answer_id = %s
            """, (answer_id,))

            created_answer = cursor.fetchone()
            
            if created_answer:
                # Initialize empty comments array
                created_answer['comments'] = []
                processed_answer = process_question(created_answer)
                
                return JSONResponse(content={
                    "status": "success",
                    "message": "Answer added successfully",
                    "answer": processed_answer
                })
            else:
                raise HTTPException(status_code=500, detail="Failed to retrieve created answer")

        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=str(e))

        finally:
            cursor.close()
            conn.close()

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))