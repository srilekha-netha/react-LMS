import React, { useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import "./StudentDashboard.css";            // your existing base styles
import "./StudentDashboardOverrides.css";  // the enhanced overrides

export default function StudentDashboard() {
  const location = useLocation();
  const studentName = localStorage.getItem("studentName") || "Student";

  // preload Font Awesome for footer icons
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
    document.head.appendChild(link);
  }, []);

  const navItems = [
    { to: "/student/explore", icon: "search", label: "Explore Courses" },
    { to: "/student/my-courses", icon: "book", label: "My Courses" },
    { to: "/student/assignments", icon: "upload", label: "Assignments" },
    { to: "/student/quizzes", icon: "question-circle", label: "Quizzes" },
    { to: "/student/messages", icon: "chat-left-text-fill", label: "Messages" },
    { to: "/student/payments", icon: "wallet2", label: "Payments" },
    { to: "/student/profile", icon: "person", label: "Profile & Settings" },
  ];

  return (
    <>
      {/* Bootstrap & Icons */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
        rel="stylesheet"
      />

      {/* Header */}
      <nav className="student-navbar">
        <div className="student-nav-left">
          <span className="logo-title">🎓 LMS Student</span>
          
        </div>
        <div className="student-nav-actions">
          <Link to="/student/notifications" className="btn btn-link p-0">
            <i className="bi bi-bell-fill fs-4 text-white"></i>
          </Link>
          <Link to="/student/logout" className="btn btn-outline-light btn-sm">
            <i className="bi bi-box-arrow-right me-1"></i>Logout
          </Link>
        </div>
      </nav>

      {/* Body */}
      <div className="dashboard-body">
        {/* Sidebar */}
        <aside className="student-sidebar">
          <h5 className="sidebar-title">
            <i className="bi bi-person-fill me-2"></i>
            {studentName}
          </h5>
          <ul className="sidebar-nav">
            {navItems.map((item) => (
              <li
                key={item.to}
                className={`sidebar-nav-item ${
                  location.pathname.startsWith(item.to) ? "active" : ""
                }`}
              >
                <Link to={item.to} className="sidebar-link">
                  <i className={`bi bi-${item.icon} sidebar-icon`}></i>
                  <span className="sidebar-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="student-page-content">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="student-footer">
        <div className="footer-icons">
          <a href="https://instagram.com/yourorg" target="_blank" rel="noopener noreferrer">
            <i className="fa fa-instagram"></i>
          </a>
          <a href="https://t.me/yourorg" target="_blank" rel="noopener noreferrer">
            <i className="fa fa-telegram"></i>
          </a>
          <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
            <i className="fa fa-whatsapp"></i>
          </a>
        </div>
        <p>© {new Date().getFullYear()} Forge IT LMS. All rights reserved.</p>
      </footer>
    </>
  );
}
