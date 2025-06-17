import React, { useEffect, useState } from "react";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Dummy notifications – replace with API or WebSocket for real-time updates
    const dummyNotifications = [
      { id: 1, icon: "bi bi-person-plus-fill", text: "Student Anjali enrolled in React Basics", time: "2h ago" },
      { id: 2, icon: "bi bi-file-earmark-text-fill", text: "Quiz submitted by Ramesh in JavaScript Advanced", time: "4h ago" },
      { id: 3, icon: "bi bi-chat-dots-fill", text: "New message from student Ravi Kumar", time: "1d ago" },
      { id: 4, icon: "bi bi-file-earmark-arrow-up-fill", text: "Assignment submitted for HTML Course", time: "2d ago" },
    ];
    setNotifications(dummyNotifications);
  }, []);

  return (
    <div className="container-fluid">
      <h2 className="my-4">Notifications</h2>

      {notifications.length === 0 ? (
        <div className="alert alert-info">No new notifications.</div>
      ) : (
        <div className="card shadow-sm" style={{ maxWidth: "600px" }}>
          <ul className="list-group list-group-flush">
            {notifications.map((note) => (
              <li key={note.id} className="list-group-item d-flex align-items-start">
                <i className={`${note.icon} fs-4 text-primary me-3`}></i>
                <div className="flex-grow-1">
                  <p className="mb-1">{note.text}</p>
                  <small className="text-muted">{note.time}</small>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Notifications;
