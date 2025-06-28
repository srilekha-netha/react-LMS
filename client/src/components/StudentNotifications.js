import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function StudentNotifications() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user._id) return;

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/notifications/user/${user._id}`
        );
        const unread = res.data.filter((n) => !n.read);
        setNotifications(unread);
      } catch (err) {
        console.error("❌ Error loading notifications:", err);
      }
    };

    fetchNotifications();
  }, []);

  const markReadAndNavigate = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/notifications/read/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));

      // ✅ Now actually navigate to student/messages
      navigate("/student/messages");
    } catch (err) {
      console.error("❌ Error marking notification as read:", err);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Notifications</h2>

      {notifications.length === 0 ? (
        <div className="alert alert-info">No new notifications.</div>
      ) : (
        <div className="card shadow-sm mx-auto" style={{ maxWidth: "700px" }}>
          <ul className="list-group list-group-flush">
            {notifications.map((note) => (
              <li
                key={note._id}
                className="list-group-item d-flex align-items-start justify-content-between bg-light border-start border-4 border-primary"
                style={{ cursor: "default" }}
              >
                <div className="d-flex align-items-start gap-2">
                  <i
                    className={`${note.icon || "bi bi-bell-fill"} text-primary mt-1`}
                    style={{ fontSize: "1.2rem" }}
                  ></i>
                  <div>
                    <p className="mb-1 fw-semibold">
                      {note.text || "🔔 New notification"}
                    </p>
                    <small className="text-muted">
                      {note.createdAt
                        ? new Date(note.createdAt).toLocaleString("en-GB")
                        : "Unknown time"}
                    </small>
                  </div>
                </div>

                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => markReadAndNavigate(note._id)}
                >
                  Mark as Read
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default StudentNotifications;
