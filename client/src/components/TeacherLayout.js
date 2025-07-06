import React, { useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import "./TeacherLayout.css";

export default function TeacherLayout() {
  const location = useLocation();
  const teacherName = localStorage.getItem("studentName") || "Teacher";

  // load Font-Awesome for footer icons
  useEffect(() => {
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href =
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
      document.head.appendChild(link);
    }
  }, []);

  const navItems = [
    { to: "/teacher/courses", icon: "journal-bookmark-fill", label: "My Courses" },
    { to: "/teacher/create-course", icon: "plus-circle", label: "Create Course" },
    { to: "/teacher/assignments", icon: "clipboard-check-fill", label: "Assignments" },
    { to: "/teacher/students", icon: "people-fill", label: "Students" },
    { to: "/teacher/messages", icon: "chat-left-text-fill", label: "Messages" },
    { to: "/teacher/profile", icon: "person-circle", label: "Profile" },
    { to: "/teacher/earnings", icon: "cash-coin", label: "Earnings" }
  ];

  return (
    <>
      {/* Fixed header */}
      <nav className="admin-navbar">
        <span className="logo-title">📘 LMS</span>
        <div className="d-flex align-items-center">
          <span className="teacher-nav-user d-none d-md-inline me-4">
            <i className="bi bi-person-circle me-2" /> {teacherName}
          </span>
          <Link to="/teacher/notifications" className="btn btn-link teacher-nav-link me-3">
            <i className="bi bi-bell-fill" />
          </Link>
          <Link to="/teacher/logout" className="btn btn-outline-light btn-sm teacher-logout-btn">
            <i className="bi bi-box-arrow-right me-1" />
            <span className="d-none d-md-inline">Logout</span>
          </Link>
        </div>
      </nav>

      {/* Sidebar + Main Content */}
      <div className="admin-body">
        <aside className="admin-sidebar">
          <h5 className="sidebar-title d-none d-md-block">
            <i className="bi bi-person-workspace me-2" /> {teacherName}
          </h5>
          <ul className="sidebar-nav">
            {navItems.map(item => (
              <li
                key={item.to}
                className={location.pathname.startsWith(item.to) ? "active" : ""}
              >
                <Link to={item.to} className="sidebar-link">
                  <i className={`bi bi-${item.icon} sidebar-icon`} />
                  <span className="sidebar-label d-none d-md-inline">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>

      {/* Footer at end of flow */}
      <footer className="admin-footer">
        <div className="footer-icons">
          <a href="https://instagram.com/yourorg" className="btn-social">
            <i className="fa fa-instagram" />
          </a>
          <a href="https://t.me/yourorg" className="btn-social">
            <i className="fa fa-telegram" />
          </a>
          <a href="https://wa.me/919876543210" className="btn-social">
            <i className="fa fa-whatsapp" />
          </a>
        </div>
        <p className="small">© {new Date().getFullYear()} LMS Teacher Dashboard. All rights reserved.</p>
      </footer>
    </>
  );
}
