import socketio


socket = socketio.AsyncServer(
    cors_allowed_origins=["http://localhost:3000"], 
    async_mode='asgi'
)

socket_app = socketio.ASGIApp(
   socketio_server= socket, 
   socketio_path="/ws/socket.io"
)

# @socket.event
# async def connect (sid):
#     print(f:)