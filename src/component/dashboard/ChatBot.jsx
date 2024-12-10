import React, { useState } from "react";
import axios from "axios";

const ChatBot = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/chat", { message }); // This works with the Vite proxy setup
      setResponse(res.data.message);
    } catch (error) {
      console.error("Error fetching response from backend:", error);
    }
  };

  return (
    <div>
      <h1>ChatBot</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message"
        />
        <button type="submit">Send</button>
      </form>
      {response && <p>Response: {response}</p>}
    </div>
  );
};

export default ChatBot;
