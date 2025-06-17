import React, { useState } from "react";
import "./StudentDashboard.css";

function StudentMessages() {
  const [messages, setMessages] = useState([
    { sender: "teacher", text: "Hi! Please submit the assignment by Friday." },
    { sender: "student", text: "Sure, I'll complete it by tomorrow!" },
    { sender: "teacher", text: "Also, check the updated quiz for Chapter 2." },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim() === "") return;
    setMessages([...messages, { sender: "student", text: newMessage }]);
    setNewMessage("");
  };

  return (
    <div className="message-container">
      <h3 className="mb-3 text-center text-primary">📩 Teacher-Student Messages</h3>
      <div className="message-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-bubble ${
              msg.sender === "student" ? "student-msg" : "teacher-msg"
            }`}
          >
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="message-input-area">
        <input
          type="text"
          placeholder="Type your message..."
          className="form-control"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="btn btn-primary ms-2" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}

export default StudentMessages;
