import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import "./StudentDashboard.css";

function StudentDashboard() {
  const location = useLocation();
  const studentName = localStorage.getItem("studentName") || "Student";

  const navItems = [
    { to: "/student/explore", icon: "search", label: "Explore Courses" },
    { to: "/student/my-courses", icon: "book", label: "My Courses" },
    { to: "/student/progress", icon: "bar-chart-line", label: "Progress Tracker" },
    { to: "/student/assignments", icon: "upload", label: "Assignments" },
    { to: "/student/quizzes", icon: "question-circle", label: "Quizzes" },
    { to: "/student/messages", icon: "chat-left-text-fill", label: "Messages" },
    { to: "/student/payments", icon: "wallet2", label: "Payments" },
    { to: "/student/profile", icon: "person", label: "Profile & Settings" },
  ];

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      />

      <div className="dashboard-wrapper">
        {/* Top Navbar */}
        <nav className="student-navbar">
          <span className="fw-bold logo-title">🎓 LMS Student</span>
          <div className="d-flex align-items-center gap-4">
            <span className="student-nav-user">
              <i className="bi bi-person-circle me-2"></i> {studentName}
            </span>
            <Link to="/student/notifications" className="btn btn-link teacher-nav-link me-3 ">
              <i className="bi bi-bell-fill" />
            </Link>
            <Link to="/student/logout" className="btn btn-outline-light btn-sm student-logout-btn">
              <i className="bi bi-box-arrow-right me-1"></i> Logout
            </Link>
          </div>
        </nav>

        {/* Body section */}
        <div className="dashboard-body">
          {/* Sidebar */}
          <aside className="student-sidebar">
            <h5 className="sidebar-title">
              <i className="bi bi-person-fill me-2"></i> {studentName}
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

          {/* Main Content */}
          <main className="student-page-content">
            <Outlet />
          </main>
        </div>

        {/* Footer */}
        <footer className="admin-footer">
          <div className="footer-icons">
            <a href="https://instagram.com/yourorg" target="_blank" rel="noopener noreferrer">
              <i className="fa fa-instagram" />
            </a>
            <a href="https://t.me/yourorg" target="_blank" rel="noopener noreferrer">
              <i className="fa fa-telegram" />
            </a>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
              <i className="fa fa-whatsapp" />
            </a>
          </div>
          <p className="small mb-0">
            © {new Date().getFullYear()} Forge IT LMS. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
}

export default StudentDashboard;
