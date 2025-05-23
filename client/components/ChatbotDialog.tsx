import React from 'react'

interface Message {
    messages: string[];
    className?: string;
}

const ChatbotDialog = ({ messages, className }: Message) => {
  console.log("LOGGED: ", messages);
  return (
    <div className={`${className}`}>
      <div className="flex flex-col space-y-2 w-full p-8">
        {messages.map((value, i) => (
            <div 
                key={i} 
                className={`w-1/2 p-2 text-white rounded-lg chatbot-msg 
                    ${i % 2 === 0 ? "bg-black" : "bg-sky-500 self-end"}`}
            >
                <p className="whitespace-normal break-words">{value}</p>
            </div>
        ))}
      </div>
    </div>
  )
}

export default ChatbotDialog;
