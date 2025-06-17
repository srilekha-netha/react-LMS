import React from "react";
import { Outlet, Link } from "react-router-dom";

function StudentDashboard() {
  const wrapperStyle = {
    width: "100vw",
    minHeight: "100vh",
    margin: 0,
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
  };

  const topNavbarStyle = {
    flex: "0 0 auto",
    padding: "0.5rem 1rem",
    backgroundColor: "#0d6efd",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  };

  const contentWrapperStyle = {
    display: "flex",
    flex: "1 1 auto",
    overflow: "hidden",
  };

  const sidebarStyle = {
    flex: "0 0 250px",
    position: "sticky",
    top: "56px",
    height: "calc(100vh - 56px)",
    overflowY: "auto",
    backgroundColor: "#212529",
    color: "white",
    padding: "1rem",
  };

  const navLinkStyle = {
    color: "white",
    textDecoration: "none",
    padding: "0.5rem 0.75rem",
    display: "block",
    borderRadius: "4px",
  };

  const navLinkHoverBg = "rgba(255, 255, 255, 0.1)";

  const mainContentStyle = {
    flex: "1 1 auto",
    padding: "1.5rem",
    overflowY: "auto",
    backgroundColor: "#f8f9fa",
  };

  return (
    <>
      <style>{`
        html, body, #root {
          margin: 0; padding: 0; height: 100%;
        }
      `}</style>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
        rel="stylesheet"
      />

      <div style={wrapperStyle}>
        {/* Top Navbar */}
        <nav style={topNavbarStyle}>
          <span className="fw-bold">🎓 LMS Student</span>
          <div className="d-flex align-items-center gap-4">
            <span>
              <i className="bi bi-person-circle me-2"></i> Student
            </span>
            <Link to="/student/notifications" className="text-white text-decoration-none">
              <i className="bi bi-bell-fill me-1"></i> Notifications
            </Link>
            <Link to="/student/logout" className="btn btn-outline-light btn-sm">
              <i className="bi bi-box-arrow-right me-1"></i> Logout
            </Link>
          </div>
        </nav>

        {/* Sidebar + Main Content */}
        <div style={contentWrapperStyle}>
          {/* Sidebar */}
          <aside style={sidebarStyle}>
            <h5 className="text-center mb-4">
              <i className="bi bi-mortarboard-fill me-2"></i> Student Panel
            </h5>
            <ul className="nav flex-column gap-2">
              {[
                { to: "/student/explore", icon: "search", label: "Explore Courses" },
                { to: "/student/my-courses", icon: "book", label: "My Courses" },
                { to: "/student/progress", icon: "bar-chart-line", label: "Progress Tracker" },
                { to: "/student/assignments", icon: "upload", label: "Assignments" },
                { to: "/student/quizzes", icon: "question-circle", label: "Quizzes" },
                { to: "/student/messages", icon: "chat-left-text-fill", label: "Messages" },
                { to: "/student/payments", icon: "wallet2", label: "Payments" },
                { to: "/student/profile", icon: "person", label: "Profile & Settings" },
              ].map((item, idx) => (
                <li className="nav-item" key={idx}>
                  <Link
                    to={item.to}
                    style={navLinkStyle}
                    className="nav-link"
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = navLinkHoverBg}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <i className={`bi bi-${item.icon} me-2`}></i>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          {/* Main Content */}
          <main style={mainContentStyle}>
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}

export default StudentDashboard;
