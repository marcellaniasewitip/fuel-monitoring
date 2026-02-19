import machine
import time
import network
import urequests
import json

# --- CONFIGURATION ---
WIFI_SSID = "Starlink_Mining_Camp_Alpha"
WIFI_PASS = "PNG_Mining_2026"
API_URL = "https://your-backend-service.railway.app/api/ingest"
SITE_ID = "1" 

# --- HARDWARE SETUP ---
wdt = machine.WDT(timeout=30000) 

# Ultrasonic Sensor (Fuel) & Thermistor (Temp)
fuel_sensor = machine.ADC(machine.Pin(34))
temp_sensor = machine.ADC(machine.Pin(35))
pump_relay_signal = machine.Pin(12, machine.Pin.IN) 

# PHYSICAL KILL SWITCH RELAY
# Pin 14 controls the relay that breaks the pump's power circuit
relay_pin = machine.Pin(14, machine.Pin.OUT)
relay_pin.value(1) # Default to ON (Active High relay)

def read_sensors():
    readings = []
    for _ in range(10):
        readings.append(fuel_sensor.read())
        time.sleep(0.1)
    avg_raw = sum(readings) / 10
    fuel_liters = (avg_raw / 4095) * 10000 
    return int(fuel_liters)

while True:
    wdt.feed() 
    try:
        fuel = read_sensors()
        payload = {
            "site_id": SITE_ID,
            "fuel_level": fuel,
            "temp": 32, 
            "pump_status": "ON" if pump_relay_signal.value() == 1 else "OFF"
        }
        
        # POST to Backend
        res = urequests.post(API_URL, json=payload)
        
        if res.status_code == 200:
            data = res.json()
            # GET COMMAND FROM BACKEND
            pump_allowed = data.get("command_pump_enabled", True)
            
            if not pump_allowed:
                relay_pin.value(0) # CUT POWER TO PUMP
                print("COMMAND RECEIVED: PUMP LOCKED")
            else:
                relay_pin.value(1) # RESTORE POWER
                print("COMMAND RECEIVED: PUMP READY")
        
        res.close()
        
    except Exception as e:
        print("Network error, retrying...", e)
    
    # In PNG mining, update every 30s is a good balance for Starlink data
    time.sleep(30)