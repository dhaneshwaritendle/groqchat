import React, { useState } from 'react';
import axios from 'axios';

const Chat = () => {
  const [userMessage, setUserMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);

  // Function to handle message submission
  const handleSendMessage = async () => {
    if (userMessage.trim()) {
      // Add the user's message to the chat log
      setChatLog([...chatLog, { role: "user", content: userMessage }]);

      try {
        // Send the user's message to the backend
        const response = await axios.post('http://localhost:5000/chat', {
          message: userMessage,
        });

        // Add the AI's response to the chat log
        setChatLog([...chatLog, { role: "user", content: userMessage }, { role: "AI", content: response.data.response }]);
      } catch (error) {
        console.error("Error in getting response from the backend", error);
        alert("Failed to get a response from the AI");
      }

      // Clear the input box
      setUserMessage("");
    }
  };

  return (
    <div>
      <h2>Chat with Groq Model</h2>
      <div className="chat-box">
        {chatLog.map((chat, index) => (
          <div key={index} className={chat.role === "user" ? "user-message" : "ai-message"}>
            <strong>{chat.role}:</strong> {chat.content}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        placeholder="Type your message"
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Chat;
