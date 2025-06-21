import React, { useEffect, useState } from "react";
import axios from "axios";

function StudentNotifications() {
  const [notes, setNotes] = useState([]);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    axios.get(`http://localhost:5000/api/notifications/user/${user._id}`)
      .then(res => setNotes(res.data));
  }, []);

  const markRead = async (id) => {
    await axios.post(`http://localhost:5000/api/notifications/read/${id}`);
    setNotes(notes.map(n => n._id === id ? { ...n, read: true } : n));
  };

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notes.map((n, i) => (
          <li key={i} style={{ opacity: n.read ? 0.6 : 1 }}>
            {n.message}
            <button disabled={n.read} style={{ marginLeft: 6 }} onClick={() => markRead(n._id)}>
              {n.read ? "Read" : "Mark as read"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default StudentNotifications;
