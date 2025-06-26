import React, { useEffect, useState } from "react";
import axios from "axios";

function Messages() {
  const [to, setTo] = useState("");
  const [content, setContent] = useState("");
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || !user._id) return;

    // ✅ Load users excluding self
   axios.get("http://localhost:5000/api/users")
  .then((res) => {
    if (!user || !user._id) return;
    const filtered = res.data.filter(u => u._id !== user._id && u.role === "student");
    setUsers(filtered);
  })
  .catch(err => {
    console.error("Failed to fetch users", err);
  });



    // ✅ Load inbox
    axios.get(`http://localhost:5000/api/messages/inbox/${user._id}`)
      .then(res => setMessages(res.data.reverse()))
      .catch(err => console.error("❌ Failed to load messages", err));
  }, [user]);

  const handleSend = async () => {
    if (!to || !content.trim()) {
      alert("Please select user and enter message.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/messages/send", {
        from: user._id,
        to,
        content
      });

      alert("✅ Message sent!");
      setContent("");

      // Refresh messages
      const updated = await axios.get(`http://localhost:5000/api/messages/inbox/${user._id}`);
      setMessages(updated.data.reverse());
    } catch (err) {
      alert("❌ Failed to send message");
      console.error("Axios POST error:", err);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Messages</h2>

      <div className="mb-3">
        <label>Send To:</label>
        <select className="form-select" value={to} onChange={(e) => setTo(e.target.value)}>
          <option value="">-- Select User --</option>
          {users.map(u => (
            <option key={u._id} value={u._id}>
              {u.name} ({u.role})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label>Message:</label>
        <textarea
          className="form-control"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="3"
          placeholder="Write your message..."
        />
      </div>

      <button className="btn btn-primary mb-4" onClick={handleSend}>
        Send Message
      </button>

      <hr />
      <h5>Inbox</h5>
      <ul className="list-group">
        {messages.length === 0 ? (
          <li className="list-group-item text-muted">No messages received.</li>
        ) : (
          messages.map((msg, i) => (
            <li key={i} className="list-group-item">
              <strong>{msg.from?.name || "Unknown"}:</strong> {msg.content}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default Messages;
