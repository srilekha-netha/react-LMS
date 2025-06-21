import React, { useEffect, useState } from "react";
import axios from "axios";

function StudentMessages() {
  const [inbox, setInbox] = useState([]);
  const [sent, setSent] = useState([]);
  const [to, setTo] = useState("");
  const [course, setCourse] = useState("");
  const [content, setContent] = useState("");
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    axios.get(`http://localhost:5000/api/messages/inbox/${user._id}`).then(res => setInbox(res.data));
    axios.get(`http://localhost:5000/api/messages/sent/${user._id}`).then(res => setSent(res.data));
    axios.get(`http://localhost:5000/api/enrollments/byUser/${user._id}`).then(res => setCourses(res.data));
  }, []);

  const handleSend = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!to || !course || !content) return;
    await axios.post("http://localhost:5000/api/messages/send", {
      from: user._id,
      to,
      course,
      content,
    });
    setContent("");
    alert("Message sent!");
  };

  return (
    <div>
      <h2>Messages</h2>
      <div>
        <h4>Send Message to Teacher</h4>
        <select value={course} onChange={e => setCourse(e.target.value)}>
          <option value="">Select Course</option>
          {courses.map((en, i) => (
            <option key={i} value={en.course._id}>{en.course.title}</option>
          ))}
        </select>
        <input
          type="text"
          value={to}
          placeholder="Teacher User ID"
          onChange={e => setTo(e.target.value)}
        />
        <input
          type="text"
          value={content}
          placeholder="Your message"
          onChange={e => setContent(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
      </div>
      <div>
        <h4>Inbox</h4>
        <ul>
          {inbox.map((m, i) => (
            <li key={i}><b>{m.from.name}</b>: {m.content}</li>
          ))}
        </ul>
        <h4>Sent</h4>
        <ul>
          {sent.map((m, i) => (
            <li key={i}><b>To {m.to.name}</b>: {m.content}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default StudentMessages;
