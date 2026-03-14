import os
import logging
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Fallback for local development if not set in .env
if not SUPABASE_URL or not SUPABASE_KEY:
    logger.warning("SUPABASE_URL or SUPABASE_KEY not found in environment variables.")

def get_supabase() -> Client:
    try:
        return create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        logger.error(f"Failed to create Supabase client: {e}")
        raise

supabase: Client = get_supabase()

def test_supabase_connection():
    try:
        # Simple health check query
        supabase.table("cities").select("id").limit(1).execute()
        logger.info("Supabase connection successful.")
        return True
    except Exception as e:
        logger.error(f"Supabase connection test failed: {e}")
        return False
