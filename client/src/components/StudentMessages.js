import React, { useEffect, useState } from "react";
import axios from "axios";

function StudentMessages() {
  const [inbox, setInbox] = useState([]);
  const [sent, setSent] = useState([]);
  const [course, setCourse] = useState("");
  const [content, setContent] = useState("");
  const [courses, setCourses] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user || !user._id) return;

    // Fetch inbox messages
    axios.get(`http://localhost:5000/api/messages/inbox/${user._id}`)
      .then(res => setInbox(res.data || []))
      .catch(err => console.error("Inbox load error", err));

    // Fetch sent messages
    axios.get(`http://localhost:5000/api/messages/sent/${user._id}`)
      .then(res => setSent(res.data || []))
      .catch(err => console.error("Sent load error", err));

    // Fetch enrolled courses
    axios.get(`http://localhost:5000/api/enrollments/byUser/${user._id}`)
      .then(res => {
        const valid = (res.data || []).filter(e => e.course && e.course._id);
        setCourses(valid);
      })
      .catch(err => console.error("Courses load error", err));
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

      // Refresh sent messages
      const sentRes = await axios.get(`http://localhost:5000/api/messages/sent/${user._id}`);
      setSent(sentRes.data || []);
    } catch (err) {
      alert("❌ Failed to send message");
      console.error(err);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Student Messages</h2>

      <div className="card p-3 mb-4">
        <h4>Send Message to Teacher</h4>
        <div className="mb-3">
          <label>Select Course:</label>
          <select
            className="form-select"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          >
            <option value="">-- Select Course --</option>
            {courses.map((enr, i) =>
              enr.course && enr.course._id ? (
                <option key={i} value={enr.course._id}>
                  {enr.course.title}
                </option>
              ) : null
            )}
          </select>
        </div>
        <div className="mb-3">
          <label>Message:</label>
          <input
            type="text"
            className="form-control"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your message"
          />
        </div>
        <button className="btn btn-primary" onClick={handleSend}>
          Send Message
        </button>
      </div>

      <div className="row">
        <div className="col-md-6">
          <h5>📥 Inbox</h5>
          <ul className="list-group">
            {inbox.length === 0 ? (
              <li className="list-group-item text-muted">No messages received</li>
            ) : (
              inbox.map((msg, i) => (
                <li key={i} className="list-group-item">
                  <strong>From: {msg?.from?.name || "Unknown"}</strong><br />
                  {msg?.content || ""}
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="col-md-6">
          <h5>📤 Sent</h5>
          <ul className="list-group">
            {sent.length === 0 ? (
              <li className="list-group-item text-muted">No messages sent</li>
            ) : (
              sent.map((msg, i) => (
                <li key={i} className="list-group-item">
                  <strong>To: {msg?.to?.name || "Unknown"}</strong><br />
                  {msg?.content || ""}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default StudentMessages;
