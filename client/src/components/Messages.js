import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TeacherLayout.css"; // Contains all styles including hover effects

function Messages() {
  const [to, setTo] = useState("");
  const [content, setContent] = useState("");
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user || !user._id) return;

    // Fetch enrolled students
    axios
      .get(`http://localhost:5000/api/enrollments/byTeacher/${user._id}`)
      .then((res) => {
        const unique = {};
        res.data.forEach((enr) => {
          if (enr.student && !unique[enr.student._id]) {
            unique[enr.student._id] = enr.student;
          }
        });
        setUsers(Object.values(unique));
      })
      .catch((err) => {
        console.error("❌ Failed to fetch enrolled students", err);
      });

    // Fetch inbox messages
    axios
      .get(`http://localhost:5000/api/messages/inbox/${user._id}`)
      .then((res) => setMessages(res.data.reverse()))
      .catch((err) => console.error("❌ Failed to load messages", err));
  }, [user]);

  const handleSend = async () => {
    if (!to || !content.trim()) {
      alert("Please select a student and enter a message.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/messages/send", {
        from: user._id,
        to,
        content,
      });

      alert("✅ Message sent!");
      setContent("");

      const updated = await axios.get(
        `http://localhost:5000/api/messages/inbox/${user._id}`
      );
      setMessages(updated.data.reverse());
    } catch (err) {
      alert("❌ Failed to send message");
      console.error("Send error:", err);
    }
  };

  const handleDelete = async (messageId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/messages/${messageId}`);
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    } catch (err) {
      alert("❌ Failed to delete message");
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Messages</h2>

      {/* Send Message Box */}
      <div className="message-box card shadow-sm mb-4">
        <div className="card-header bg-primary text-white fw-bold">
          ✉️ Send a Message
        </div>
        <div className="card-body">
          <div className="mb-3">
            <label>Send To:</label>
            <select
              className="form-select"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            >
              <option value="">-- Select Student --</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.email})
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

          <div className="text-end">
            <button className="btn btn-primary" onClick={handleSend}>
              Send Message
            </button>
          </div>
        </div>
      </div>

      {/* Inbox */}
      <hr />
      <h5>Inbox</h5>
      <ul className="list-group">
        {messages.length === 0 ? (
          <li className="list-group-item text-muted">No messages received.</li>
        ) : (
          messages.map((msg, i) => (
            <li
              key={i}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{msg.from?.name || "Unknown"}:</strong> {msg.content}
              </div>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(msg._id)}
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default Messages;
