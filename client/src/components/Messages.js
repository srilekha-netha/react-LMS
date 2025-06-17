import React, { useState, useEffect } from "react";

function Messages() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Dummy messages – replace with real-time or API call
    const dummyMessages = [
      { id: 1, from: "Student", content: "Can you extend the deadline?" },
      { id: 2, from: "Teacher", content: "Sure, you have 2 more days." },
    ];
    setMessages(dummyMessages);
  }, []);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg = {
      id: messages.length + 1,
      from: "Teacher",
      content: newMessage.trim(),
    };
    setMessages([...messages, msg]);
    setNewMessage("");
  };

  return (
    <div className="container-fluid">
      <h2 className="my-4">Messages</h2>

      {/* Message Box */}
      <div className="card mb-3" style={{ maxWidth: "600px" }}>
        <div className="card-body" style={{ maxHeight: "300px", overflowY: "auto" }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`d-flex mb-2 ${msg.from === "Teacher" ? "justify-content-end" : "justify-content-start"}`}
            >
              <div
                className={`p-2 rounded ${
                  msg.from === "Teacher" ? "bg-primary text-white" : "bg-light"
                }`}
                style={{ maxWidth: "70%" }}
              >
                <small className="text-muted">{msg.from}</small>
                <p className="mb-0">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="d-flex flex-column" style={{ maxWidth: "600px" }}>
        <textarea
          className="form-control mb-2"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          rows="3"
        />
        <div className="text-end">
          <button className="btn btn-primary" onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Messages;
