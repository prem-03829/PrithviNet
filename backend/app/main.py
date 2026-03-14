import logging
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.routers import ai, auth, environment_router
from app.services.database import get_db, get_supabase

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="PrithviNet AI Backend",
    description="Minimal FastAPI backend for environmental assistant powered by Ollama Phi-3",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
# Note: Prefixes are defined within the routers themselves.
app.include_router(ai)
app.include_router(auth)
app.include_router(environment_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "PrithviNet AI API is running. Visit /docs for documentation."}

@app.get("/db-test")
def test_db(supabase=Depends(get_supabase)):
    try:
        # Simple query to test connection
        supabase.table("cities").select("id").limit(1).execute()
        return {"message": "Supabase connection successful."}
    except Exception as e:
        logger.error(f"Supabase connection failed: {e}")
        return {"message": f"Supabase connection failed: {str(e)}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
