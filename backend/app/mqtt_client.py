import json
from paho.mqtt import client as mqtt_client

# MQTT Configuration (Replace with your broker details)
BROKER = 'your-mqtt-broker-ip'
PORT = 1883
TOPIC = "png/mining/fuel/+"

def on_message(client, userdata, msg):
    # Decode the IoT data (e.g., {"tank_id": "T1", "level": 85.5, "temp": 42})
    payload = json.loads(msg.payload.decode())
    print(f"Received data from {msg.topic}: {payload}")
    
    # Logic: Detect theft or leaks
    if payload.get("level_drop_rate") > 5.0:
        print("⚠️ ALERT: Possible Fuel Theft Detected at Tank", payload['tank_id'])
    
    # Save to Database logic would go here...

def start_mqtt():
    client = mqtt_client.Client()
    client.on_message = on_message
    client.connect(BROKER, PORT)
    client.subscribe(TOPIC)
    client.loop_start()