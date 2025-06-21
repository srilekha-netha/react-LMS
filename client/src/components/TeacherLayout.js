import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import "./StudentDashboard.css";

function TeacherLayout() {
  const location = useLocation();

  const navItems = [
    { to: "/teacher/courses", icon: "journal-bookmark-fill", label: "My Courses" },
    { to: "/teacher/create-course", icon: "plus-circle", label: "Create Course" },
    { to: "/teacher/assignments", icon: "clipboard-check-fill", label: "Assignments" },
    { to: "/teacher/students", icon: "people-fill", label: "Students" },
    { to: "/teacher/messages", icon: "chat-left-text-fill", label: "Messages" },
    { to: "/teacher/profile", icon: "person-circle", label: "Profile" },
    { to: "/teacher/earnings", icon: "cash-coin", label: "Earnings" },
  ];

  return (
    <>
      {/* Bootstrap CSS and icons */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
        rel="stylesheet"
      />

      <div className="teacher-dashboard-wrapper">
        {/* Header */}
        <nav className="teacher-navbar">
          <span className="fw-bold logo-title">📘 LMS</span>
          <div className="d-flex align-items-center gap-4">
            <span className="teacher-nav-user">
              <i className="bi bi-person-circle me-2"></i> Teacher
            </span>
            <Link to="/teacher/notifications" className="teacher-nav-link">
              <i className="bi bi-bell-fill me-1"></i> <span className="d-none d-md-inline">Notifications</span>
            </Link>
            <Link to="/teacher/logout" className="btn btn-outline-light btn-sm ms-1 teacher-logout-btn">
              <i className="bi bi-box-arrow-right me-1"></i> Logout
            </Link>
          </div>
        </nav>

        {/* Main Layout */}
        <div className="teacher-main-content">
          {/* Sidebar */}
          <aside className="teacher-sidebar">
            <h5 className="sidebar-title">
              <i className="bi bi-person-workspace me-2"></i> Teacher Panel
            </h5>
            <ul className="sidebar-nav">
              {navItems.map((item) => (
                <li
                  className={`sidebar-nav-item ${
                    location.pathname.startsWith(item.to) ? "active" : ""
                  }`}
                  key={item.to}
                >
                  <Link to={item.to} className="sidebar-link">
                    <span className="sidebar-icon">
                      <i className={`bi bi-${item.icon}`}></i>
                    </span>
                    <span className="sidebar-label">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          {/* Page Content */}
          <main className="teacher-page-content">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}

export default TeacherLayout;
