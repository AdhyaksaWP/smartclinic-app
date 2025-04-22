import time
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait

from serialdata import SerialData
from whatsapp import SendToChatbot
from sockets import socket_app, socket

app = FastAPI()

app.mount("/ws", app=socket_app)

# Initialize WebDriver with options
cService = webdriver.ChromeService(executable_path = '/usr/lib/chromium-browser/chromedriver')
driver = webdriver.Chrome(service = cService)

# Login to WhatsApp web
driver.get("https://web.whatsapp.com/")

# Wait for QR code scan
wait = WebDriverWait(driver, 600)

chatbot = SendToChatbot(driver=driver, wait=wait)

@app.post("/api/serial")
async def serial_api(req: Request):
    try:
        body = await req.json()
        current_sensor = body.get("current_sensor")
        # current_step = body.get("current_step")
        
        # time.sleep(10)
        serial = SerialData()

        sensors_data = {
            "sensors_data": serial.sensor_readings(current_sensor=current_sensor)
        }
        return JSONResponse(content=sensors_data)
    except Exception as e:
        print("An Error has Occured on Python Side", e)
        return JSONResponse(content=e)

@socket.on("Sensor_Message")
async def message(sid, data):
    print("Received sensor data from client: ", data)
    chatbot.target_chat('Arjunda ELINS 22')
    chatbot.sendcsv(data)
    chatbot.scrape_chat()

@socket.on("Client_Message")
async def message(sid, data):
    print("Received question data from client: ", data)
    chatbot.send_questions(data)
    response = chatbot.scrape_chat()
    await socket.emit("Server_Message", response)

@socket.on("connect")
async def connect(sid, env):
    print("New Client Connected to This id: ", str(sid))
    # await socket.emit("Server_Message", "Hello from server")

@socket.on("disconnect")
async def disconnect(sid):
    print("Client Disconnected: "+" "+str(sid))
    # await socket.emit("Server_Message", "Goodbye from server")

