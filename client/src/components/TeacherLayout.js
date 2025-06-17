import React from "react";
import { Outlet, Link } from "react-router-dom";

function TeacherLayout() {
  // Inline styles
  const wrapperStyle = {
    width: "100vw",
    minHeight: "100vh",
    margin: 0,
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",   // allow page scroll
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
    top: "56px",           // height of navbar (~56px)
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
      {/* Reset margins and load Bootstrap */}
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
        {/* Top Navbar (sticky) */}
        <nav style={topNavbarStyle}>
          <span className="fw-bold">📘 LMS</span>
          <div className="d-flex align-items-center gap-4">
            <span>
              <i className="bi bi-person-circle me-2"></i> Teacher
            </span>
            <Link to="/teacher/notifications" className="text-white text-decoration-none">
              <i className="bi bi-bell-fill me-1"></i> Notifications
            </Link>
            <Link to="/teacher/logout" className="btn btn-outline-light btn-sm">
              <i className="bi bi-box-arrow-right me-1"></i> Logout
            </Link>
          </div>
        </nav>

        {/* Sidebar + Main Content */}
        <div style={contentWrapperStyle}>
          {/* Sidebar (sticky under navbar) */}
          <aside style={sidebarStyle}>
            <h5 className="text-center mb-4">
              <i className="bi bi-person-workspace me-2"></i> Teacher Panel
            </h5>
            <ul className="nav flex-column gap-2">
              {[
                { to: "/teacher/courses", icon: "journal-bookmark-fill", label: "My Courses" },
                { to: "/teacher/create-course", icon: "plus-circle", label: "Create Course" },
                { to: "/teacher/assignments", icon: "clipboard-check-fill", label: "Assignments" },
                { to: "/teacher/students", icon: "people-fill", label: "Students" },
                { to: "/teacher/messages", icon: "chat-left-text-fill", label: "Messages" },
                { to: "/teacher/profile", icon: "person-circle", label: "Profile" },
                { to: "/teacher/earnings", icon: "cash-coin", label: "Earnings" },
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

          {/* Main Content (scrollable) */}
          <main style={mainContentStyle}>
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}

export default TeacherLayout;
