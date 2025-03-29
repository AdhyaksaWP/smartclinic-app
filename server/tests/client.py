import socketio
import asyncio

socket_client = socketio.AsyncClient()

@socket_client.event
async def connect():
   print("I'm Connected")

async def main():
   await socket_client.connect(url='http://127.0.0.1:8000/ws', socketio_path='sockets')
   
asyncio.run(main())