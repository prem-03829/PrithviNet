import logging
from app.core.supabase import supabase
from app.schemas.auth_schema import RegisterRequest, LoginRequest

# Configure logging
logger = logging.getLogger(__name__)

# -----------------------------
# City Utilities
# -----------------------------

def get_or_create_city(city_name: str):
    """Get city id or create if not exists in public.cities table"""
    try:
        # Check if city exists
        result = supabase.table("cities").select("id").eq("name", city_name).execute()
        if result.data:
            return result.data[0]["id"]
        
        # Create city
        new_city = supabase.table("cities").insert({"name": city_name}).execute()
        if new_city.data:
            return new_city.data[0]["id"]
        return None
    except Exception as e:
        logger.error(f"Error in get_or_create_city: {e}")
        return None

# -----------------------------
# Register User
# -----------------------------

def register_user(db, user_data: RegisterRequest):
    """
    Registers a user using Supabase Auth.
    No local hashing - Supabase Auth handles it.
    """
    try:
        # 1. Sign up with Supabase Auth
        # Metadata is stored in auth.users (raw_user_meta_data)
        auth_response = supabase.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password,
            "options": {
                "data": {
                    "name": user_data.name,
                    "city": user_data.city
                }
            }
        })

        if not auth_response.user:
            return {"error": "Failed to create user account in Supabase Auth"}

        # 2. Synchronize with our public.users table for application logic
        # Get city ID from our public schema
        city_id = get_or_create_city(user_data.city)

        # Note: We do NOT store password in public.users. 
        # Supabase Auth manages it securely in the auth schema.
        new_user_payload = {
            "name": user_data.name,
            "email": user_data.email,
            "city_id": city_id
        }
        
        # We can use the ID from Supabase Auth if we want them perfectly synced
        # result = supabase.table("users").insert(new_user_payload).execute()

        return {
            "message": "User registered successfully. Please check your email for confirmation.",
            "user": auth_response.user,
            "session": auth_response.session
        }
    except Exception as e:
        logger.error(f"Registration error: {e}")
        return {"error": str(e)}

# -----------------------------
# Login User
# -----------------------------

def authenticate_user(db, login_data: LoginRequest):
    """
    Authenticates a user using Supabase Auth.
    No local hashing/verification - Supabase Auth handles it.
    """
    try:
        # Sign in with email and raw password
        auth_response = supabase.auth.sign_in_with_password({
            "email": login_data.email,
            "password": login_data.password
        })

        if not auth_response.session:
            return {"error": "Invalid credentials or email not confirmed"}

        return {
            "message": "Login successful",
            "access_token": auth_response.session.access_token,
            "token_type": "bearer",
            "user": auth_response.user,
            "session": auth_response.session
        }
    except Exception as e:
        logger.error(f"Authentication error: {e}")
        # Clean up Supabase error messages if they contain technical details
        error_msg = str(e)
        if "Invalid login credentials" in error_msg:
            error_msg = "Invalid email or password"
        return {"error": error_msg}
