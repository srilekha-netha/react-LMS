import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ✅ Fetch unread notifications for the logged-in teacher
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?._id) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/notifications/user/${user._id}`);
        const unread = (res.data || []).filter((n) => !n.read);
        setNotifications(unread);
      } catch (err) {
        console.error("❌ Failed to fetch notifications", err);
        setNotifications([]);
      }
    };

    fetchNotifications();
  }, [user._id]);

  // ✅ Mark as read and navigate appropriately
  const handleNotificationClick = async (note) => {
    try {
      await axios.post(`http://localhost:5000/api/notifications/read/${note._id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== note._id));

      // Smart route detection
      const lower = note.text?.toLowerCase() || "";
      if (lower.includes("submitted assignment")) {
        navigate("/teacher/assignments");
      } else if (lower.includes("message")) {
        navigate("/teacher/messages");
      } else {
        navigate("/teacher/dashboard");
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
                className="list-group-item d-flex align-items-start justify-content-between bg-light border-start border-4 border-primary"
                style={{ cursor: "pointer" }}
                onClick={() => handleNotificationClick(note)}
                title="Click to open and mark as read"
              >
                <div className="d-flex align-items-start gap-2">
                  <i
                    className={`${note.icon || "bi bi-bell-fill"} text-primary mt-1`}
                    style={{ fontSize: "1.2rem" }}
                  ></i>
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
                    e.stopPropagation(); // Prevent parent click
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
