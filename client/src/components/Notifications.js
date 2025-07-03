import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // ✅ Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/notifications/user/${user._id}`);
        // Only show unread notifications
        setNotifications(res.data.filter((n) => !n.read));
      } catch (err) {
        console.error("❌ Failed to fetch notifications", err);
        setNotifications([]);
      }
    };

    if (user?._id) fetchNotifications();
  }, [user?._id]);

  // ✅ Mark notification as read and navigate
  const handleNotificationClick = async (note) => {
    try {
      await axios.post(`http://localhost:5000/api/notifications/read/${note._id}`);

      // Remove notification from UI
      setNotifications((prev) => prev.filter((n) => n._id !== note._id));

      // Smart navigation
      if (note.text?.toLowerCase().includes("submitted assignment")) {
        navigate("/teacher/assignments");
      } else {
        navigate("/teacher/messages");
      }
    } catch (err) {
      console.error("❌ Failed to mark as read or navigate:", err);
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
                onClick={() => handleNotificationClick(note)}
                className="list-group-item d-flex align-items-start justify-content-between bg-light border-start border-4 border-primary"
                style={{ cursor: "pointer", transition: "background-color 0.3s" }}
                title="Click to mark as read and view"
              >
                <div className="d-flex align-items-start gap-2">
                  <i className={`${note.icon || "bi bi-bell-fill"} text-primary mt-1`} style={{ fontSize: "1.2rem" }}></i>
                  <div>
                    <p className="mb-1 fw-semibold">{note.text || "🔔 New notification"}</p>
                    <small className="text-muted">
                      {note.createdAt
                        ? new Date(note.createdAt).toLocaleString("en-GB")
                        : "Unknown time"}
                    </small>
                  </div>
                </div>

                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={(e) => {
                    e.stopPropagation(); // Don't trigger li click
                    handleNotificationClick(note);
                  }}
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

export default Notifications;
