import os
from fastapi import FastAPI, Request
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()
app = FastAPI(title="PNG Mining IoT API")

# Connect to Supabase
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

@app.post("/api/sites/{site_id}/toggle-pump")
async def toggle_pump(site_id: str, enabled: bool):
    """Triggered by the React Dashboard button"""
    supabase.table("sites").update({"pump_enabled": enabled}).eq("id", site_id).execute()
    return {"status": "command_queued", "pump_enabled": enabled}

@app.post("/api/ingest")
async def ingest_sensor_data(data: dict):
    site_id = data.get("site_id")
    new_level = data.get("fuel_level")  # Liters from ESP32
    pump_on = data.get("pump_status") == "ON"
    temp = data.get("temp")

    # 1. FETCH LAST KNOWN DATA (To compare)
    last_data = supabase.table("sites").select("fuel_level_liters").eq("id", site_id).single().execute()
    site_status = supabase.table("sites").select("pump_enabled").eq("id", site_id).single().execute()
    pump_allowed = site_status.data.get("pump_enabled", True)
    
    if last_data.data:
        previous_level = last_data.data['fuel_level_liters']
        fuel_loss = previous_level - new_level

        # 2. THEFT LOGIC: 
        # If we lost > 20 liters in 60 seconds while the pump was OFF
        if not pump_on and fuel_loss > 20:
            supabase.table("alerts").insert({
                "site_id": site_id,
                "type": "theft",
                "severity": "critical",
                "message": f"CRITICAL: Sudden fuel drop of {fuel_loss}L detected. Pump is OFF.",
                "site": "Porgera Gold Mine" # Or dynamic name
            }).execute()

        # 3. LEAK LOGIC:
        # If we lost small amounts (e.g., 2L) consistently while pump is OFF
        elif not pump_on and 2 < fuel_loss <= 20:
             supabase.table("alerts").insert({
                "site_id": site_id,
                "type": "leak",
                "severity": "warning",
                "message": f"Possible slow leak or valve weep: {fuel_loss}L lost.",
                "site": "Porgera Gold Mine"
            }).execute()

    # 4. UPDATE MASTER TABLE
    # Convert liters back to % for your React Dashboard gauges
    fuel_percentage = (new_level / 10000) * 100 
    
    supabase.table("sites").update({
        "fuel_level": fuel_percentage,
        "fuel_level_liters": new_level, # New column for precision
        "temperature": temp,
        "status": "online",
        "last_sync": "now()"
    }).eq("id", site_id).execute()

    # 5. LOG HISTORY (For your FuelChart.tsx)
    supabase.table("fuel_logs").insert({
        "site_id": site_id,
        "level_liters": new_level,
        "temp_celsius": temp
    }).execute()

    return {"status": "success", "command_pump_enabled": pump_allowed}