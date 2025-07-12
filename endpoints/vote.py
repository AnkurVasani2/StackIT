from fastapi import APIRouter, HTTPException
from models.Vote import VoteModel, VoteType, VoteAction
from config.database import get_db_connection
from typing import Dict

router = APIRouter()

@router.post("/vote", response_model=Dict)
async def update_vote(vote: VoteModel):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        try:
            conn.start_transaction()

            # Check if user exists
            cursor.execute("""
                SELECT user_id FROM users WHERE user_id = %s
            """, (vote.user_id,))
            
            if not cursor.fetchone():
                raise HTTPException(status_code=404, detail="User not found")

            action_str = vote.action.value

            if vote.type == VoteType.QUESTION:
                # Check if question exists
                cursor.execute("""
                    SELECT question_id 
                    FROM questions 
                    WHERE question_id = %s
                """, (vote.id,))
                
                if not cursor.fetchone():
                    raise HTTPException(status_code=404, detail="Question not found")

                # Check existing vote
                cursor.execute("""
                    SELECT likes, dislikes 
                    FROM question_votes 
                    WHERE question_id = %s AND user_id = %s
                """, (vote.id, vote.user_id))
                
                existing_vote = cursor.fetchone()
                
                if existing_vote:
                    # Check if trying to vote same type again
                    if (action_str == 'like' and existing_vote['likes'] == 1) or \
                       (action_str == 'dislike' and existing_vote['dislikes'] == 1):
                        raise HTTPException(
                            status_code=400,
                            detail=f"You have already {action_str}d this question"
                        )
                    
                    # Update existing vote
                    cursor.execute("""
                        UPDATE question_votes 
                        SET likes = %s, dislikes = %s
                        WHERE question_id = %s AND user_id = %s
                    """, (
                        1 if action_str == 'like' else 0,
                        1 if action_str == 'dislike' else 0,
                        vote.id,
                        vote.user_id
                    ))
                else:
                    # Insert new vote
                    cursor.execute("""
                        INSERT INTO question_votes (question_id, user_id, likes, dislikes)
                        VALUES (%s, %s, %s, %s)
                    """, (
                        vote.id,
                        vote.user_id,
                        1 if action_str == 'like' else 0,
                        1 if action_str == 'dislike' else 0
                    ))

            else:  # Answer vote
                # Check if answer exists
                cursor.execute("""
                    SELECT answer_id 
                    FROM answers 
                    WHERE answer_id = %s
                """, (vote.id,))
                
                if not cursor.fetchone():
                    raise HTTPException(status_code=404, detail="Answer not found")

                # Check existing vote
                cursor.execute("""
                    SELECT likes, dislikes 
                    FROM answer_votes 
                    WHERE answer_id = %s AND user_id = %s
                """, (vote.id, vote.user_id))
                
                existing_vote = cursor.fetchone()
                
                if existing_vote:
                    # Check if trying to vote same type again
                    if (action_str == 'like' and existing_vote['likes'] == 1) or \
                       (action_str == 'dislike' and existing_vote['dislikes'] == 1):
                        raise HTTPException(
                            status_code=400,
                            detail=f"You have already {action_str}d this answer"
                        )
                    
                    # Update existing vote
                    cursor.execute("""
                        UPDATE answer_votes 
                        SET likes = %s, dislikes = %s
                        WHERE answer_id = %s AND user_id = %s
                    """, (
                        1 if action_str == 'like' else 0,
                        1 if action_str == 'dislike' else 0,
                        vote.id,
                        vote.user_id
                    ))
                else:
                    # Insert new vote
                    cursor.execute("""
                        INSERT INTO answer_votes (answer_id, user_id, likes, dislikes)
                        VALUES (%s, %s, %s, %s)
                    """, (
                        vote.id,
                        vote.user_id,
                        1 if action_str == 'like' else 0,
                        1 if action_str == 'dislike' else 0
                    ))

            # Get updated vote counts
            if vote.type == VoteType.QUESTION:
                cursor.execute("""
                    SELECT SUM(likes) as likes, SUM(dislikes) as dislikes
                    FROM question_votes
                    WHERE question_id = %s
                """, (vote.id,))
            else:
                cursor.execute("""
                    SELECT SUM(likes) as likes, SUM(dislikes) as dislikes
                    FROM answer_votes
                    WHERE answer_id = %s
                """, (vote.id,))

            result = cursor.fetchone()
            
            conn.commit()

            return {
                "status": "success",
                "message": f"{vote.type.value} {vote.action.value}d successfully",
                "likes": result['likes'] or 0,
                "dislikes": result['dislikes'] or 0
            }

        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=str(e))

        finally:
            cursor.close()
            conn.close()

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))