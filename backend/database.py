import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv() # This loads the variables from the .env file

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")

if not url or not key:
    raise ValueError("Missing Supabase credentials in .env file")

supabase: Client = create_client(url, key)