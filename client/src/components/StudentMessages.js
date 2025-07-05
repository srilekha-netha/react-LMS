import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentDashboard.css";

function StudentMessages() {
  const [inbox, setInbox] = useState([]);
  const [sent, setSent] = useState([]);
  const [course, setCourse] = useState("");
  const [content, setContent] = useState("");
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState("inbox");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user || !user._id) return;

    const fetchAll = async () => {
      try {
        const [inboxRes, sentRes, enrollments] = await Promise.all([
          axios.get(`http://localhost:5000/api/messages/inbox/${user._id}`),
          axios.get(`http://localhost:5000/api/messages/sent/${user._id}`),
          axios.get(`http://localhost:5000/api/enrollments/byUser/${user._id}`)
        ]);

        setInbox(inboxRes.data || []);
        setSent(sentRes.data || []);
        const valid = (enrollments.data || []).filter(e => e.course && e.course._id);
        setCourses(valid);
      } catch (err) {
        console.error("❌ Load error", err);
      }
    };

    fetchAll();
  }, [user]);

  const handleSend = async () => {
    if (!course || !content.trim()) {
      alert("Please select a course and enter a message.");
      return;
    }

    const selected = courses.find(c => c.course && c.course._id === course);
    const to = selected?.course?.teacher;

    if (!to) {
      alert("Teacher not found for selected course.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/messages/send", {
        from: user._id,
        to,
        course,
        content
      });

      setContent("");
      alert("✅ Message sent!");

      const sentRes = await axios.get(`http://localhost:5000/api/messages/sent/${user._id}`);
      setSent(sentRes.data || []);
    } catch (err) {
      alert("❌ Failed to send message");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/messages/${id}`);
      setInbox(prev => prev.filter(msg => msg._id !== id));
      setSent(prev => prev.filter(msg => msg._id !== id));
    } catch (err) {
      console.error("❌ Delete error", err);
    }
  };

  return (
    <div className="message-wrapper">
      <h2 className="title">💬 Student Messages</h2>
      <br></br>
      <div className="grid-layout">
        {/* Left: Send Message */}
        <div className="send-box">
          <h4>Send Message to Teacher</h4>
          <label>Select Course</label>
          <select value={course} onChange={(e) => setCourse(e.target.value)}>
            <option value="">-- Select Course --</option>
            {courses.map((enr, i) =>
              enr.course && enr.course._id ? (
                <option key={i} value={enr.course._id}>
                  {enr.course.title}
                </option>
              ) : null
            )}
          </select>

          <label>Message</label>
          <input
            type="text"
            placeholder="Write your message..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <button onClick={handleSend}>📨 Send</button>
        </div>

        {/* Right: Tabs for Inbox and Sent */}
        <div className="tab-box">
          <div className="tabs">
            <button className={activeTab === "inbox" ? "active" : ""} onClick={() => setActiveTab("inbox")}>
              📥 Inbox
            </button>
            <button className={activeTab === "sent" ? "active" : ""} onClick={() => setActiveTab("sent")}>
              📤 Sent
            </button>
          </div>

          <div className="message-list">
            {activeTab === "inbox" &&
              (inbox.length === 0 ? (
                <p className="empty">No messages received</p>
              ) : (
                inbox.map((msg, i) => (
                  <div key={i} className="message-card">
                    <strong>From: {msg?.from?.name || "Unknown"}</strong>
                    <p>{msg?.content}</p>
                    <button onClick={() => handleDelete(msg._id)}>🗑️ Delete</button>
                  </div>
                ))
              ))}

            {activeTab === "sent" &&
              (sent.length === 0 ? (
                <p className="empty">No messages sent</p>
              ) : (
                sent.map((msg, i) => (
                  <div key={i} className="message-card">
                    <strong>To: {msg?.to?.name || "Unknown"}</strong>
                    <p>{msg?.content}</p>
                    <button onClick={() => handleDelete(msg._id)}>🗑️ Delete</button>
                  </div>
                ))
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentMessages;
