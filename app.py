from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from endpoints.routes import router as main_router
from endpoints.add_question import router as question_router
from endpoints.vote import router as vote_router  # Add this line
import uvicorn

app = FastAPI(title="Q&A Forum API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(main_router, prefix="/api/v1")
app.include_router(question_router, prefix="/api/v1")
app.include_router(vote_router, prefix="/api/v1")  # Add this line

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)