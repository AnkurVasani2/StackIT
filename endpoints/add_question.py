from fastapi import APIRouter, HTTPException
from models.QuestionCreate import QuestionCreateModel
from config.database import get_db_connection
from typing import Dict
import random
import string

router = APIRouter()

def generate_random_string(length: int) -> str:
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

@router.post("/questions/add_question", response_model=Dict)
async def add_question(question: QuestionCreateModel):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Start transaction
        conn.start_transaction()

        try:
            # Generate random username and email to avoid conflicts
            random_suffix = generate_random_string(8)
            username = f"user_{random_suffix}"
            email = f"user_{random_suffix}@example.com"

            # Insert a new user with trigger-based ID generation
            cursor.execute("""
                INSERT INTO users 
                (username, email, full_name, password_hash, mobile, skills)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                username,
                email,
                f"Temporary User {random_suffix}",
                "temp_hash",
                "1234567890",
                "general"
            ))
            
            # Get the generated user_id using the actual trigger-generated ID
            cursor.execute("SELECT user_id FROM users WHERE username = %s", (username,))
            user_data = cursor.fetchone()
            
            if not user_data:
                raise HTTPException(status_code=500, detail="Failed to create user")
            
            user_id = user_data['user_id']

            # Insert question
            cursor.execute("""
                INSERT INTO questions (user_id, title, description)
                VALUES (%s, %s, %s)
            """, (user_id, question.title, question.description))
            
            question_id = cursor.lastrowid

            # Handle tags
            for tag_title in question.tags:
                # Try to get existing tag or create new one
                cursor.execute("""
                    INSERT IGNORE INTO tags (name)
                    VALUES (%s)
                """, (tag_title,))
                
                # Get tag_id
                cursor.execute("SELECT tag_id FROM tags WHERE name = %s", (tag_title,))
                tag_id = cursor.fetchone()['tag_id']

                # Link tag to question
                cursor.execute("""
                    INSERT INTO question_tags (question_id, tag_id)
                    VALUES (%s, %s)
                """, (question_id, tag_id))

            # Commit transaction
            conn.commit()

            return {
                "status": "success",
                "message": "Question added successfully",
                "question_id": question_id,
                "user_id": user_id
            }

        except Exception as e:
            # Rollback in case of error
            conn.rollback()
            raise HTTPException(status_code=500, detail=str(e))

        finally:
            cursor.close()
            conn.close()

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))