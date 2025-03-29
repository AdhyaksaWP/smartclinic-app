import AugustAIIcon from '@/public/icons/AugustAIIcon'
import CloseIcon from '@/public/icons/CloseIcon'
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import ChatbotDialog from './ChatbotDialog';

const SOCKET_SERVER_URL = "ws://localhost:8000";

const ChatbotPopup = ({ chatbotPopup, setChatbotPopup }) => {
    const { data: session } = useSession();

    const [socket, setSocket] = useState<Socket>(null);

    const [question, setQuestion] = useState<string>("");
    const [messages, setMessages] = useState<string[]>([
        "Hi! I'm August AI what can i help you with today?"
    ]);

    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSensorDataSent, setIsSensorDataSent] = useState<boolean>(false);

    const handleSendSensorData = async () => {
        setIsLoading(true);
        try{
            const res = await fetch("http://localhost:3000/api/chatbot/fetch", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: session.user.name,
                    email: session.user.email
                })
            })
    
            if (!res.ok){
                console.log("An error has happened: ", res);
                return;
            }
            
            const { data } = await res.json();
            socket.emit("Sensor_Message", data);        
            setIsSensorDataSent(true);
    
            setMessages((prev) => [...prev, data])
        } catch {
            console.log("An error has happened on client side");
        } finally {
            setIsLoading(false);
        }
    }

    const handleSendMessage = () => {
        setIsLoading(true);
        try {
            console.log("Question: ", question);
            socket.emit("Client_Message", question);
            setMessages((prev) => [...prev, question])
        } catch {
            console.log("An error has happened on client side");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (chatbotPopup) {
            // Create socket instance
            const newSocket = io(SOCKET_SERVER_URL, {
                path: "/ws/socket.io",
            });

            // Set the socket state
            setSocket(newSocket);

            // Connection Handlers
            newSocket.on("connect", () => {
                setIsConnected(true);
                console.log("Socket client has successfully connected to the server");
            });

            newSocket.on("disconnect", () => {
                setIsConnected(false);
                console.log("Socket client has disconnected from the server");
            });

            newSocket.on("Server_Message", (msg) => {
                console.log("Received message from server:", msg);
                setMessages((prev) => [...prev, msg])
            });

            return () => {
                // Cleanup: Remove event listeners and disconnect
                newSocket.off("connect");
                newSocket.off("disconnect");
                newSocket.off("Server_Message");
                newSocket.disconnect();
                setSocket(null);
            };
        }
    }, [chatbotPopup]);


    return (
        <div className='h-full w-full absolute bg-transparent flex items-center justify-center'>
            <div className='h-4/5 w-1/2 bg-white border-2 border-sky-300 rounded-xl flex flex-col'>
                <div className='flex justify-end m-4'>
                    <CloseIcon onClick={() => {
                        setChatbotPopup(false);
                        setIsConnected(false);
                    }} className='hover:cursor-pointer'/>
                </div>
                
                <div className='flex flex-grow flex-col px-10 -my-5 mb-4'>
                    <div className='h-1/6 flex items-center gap-x-5'>
                        <AugustAIIcon className='border-2 border-black rounded-full'/>

                        <h1 className='font-inter text-xl'>
                            August AI <br></br>
                            <span className='font-inter text-sm text-gray-700 '>A Chatbot specifically designed for medical diagnosis</span>
                        </h1>
                    </div>
                    
                    <ChatbotDialog messages={messages} className='h-3/6 flex flex-col items-center overflow-y-auto'/>

                    </div>
                    {isConnected ? 
                        <div className='h-2/6 flex flex-col items-center justify-center gap-y-2'>
                            {
                                isSensorDataSent ?
                                <div className='flex flex-grow flex-col items-center justify-center gap-y-2 w-full'>
                                    <p className='text-xs font-inter text-gray-600'>If you're satisfied with the results you can close the popup</p>
                                    <textarea onChange={(e) => setQuestion(e.target.value)} className='flex-grow' placeholder='Type your questions here if theres any'></textarea>
                                </div>
                                : 
                                <p className='text-sm font-inter text-gray-600'>
                                    Click the button below to start the assessment    
                                </p> 
                            }
                            <button 
                                onClick={
                                    isSensorDataSent? 
                                    () => handleSendMessage() 
                                    :
                                    () => handleSendSensorData()
                                } 
                                className={
                                    `w-72 h-20 rounded-2xl text-white font-bold font-inter 
                                    text-2xl bg-black hover:bg-gray-800 flex items-center justify-center  
                                    ${isLoading ? "opacity-50 cursor-not-allowed" 
                                    : 
                                    ""}`
                                }>

                                {isLoading ? (
                                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    "Send Data to Chatbot"
                                )}
                            </button> 
                        </div>
                            :
                        <p>Socket.io client hasnt connected yet</p>
                    }
            </div>
        </div>
  );
}

export default ChatbotPopup