import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";

function StudentDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeLink, setActiveLink] = useState("");

  const toggleSidebar = () => setCollapsed(!collapsed);
  const topNavbarHeight = 70; // Increased height

  const topNavbarStyle = {
    height: `${topNavbarHeight}px`,
    padding: "0.75rem 1.5rem", // Increased padding
    backgroundColor: "#1c1f23",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
    fontSize: "1.05rem",
  };

  const wrapperStyle = {
    width: "100vw",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#212529",
  };

  const sidebarStyle = {
    position: "fixed",
    top: 0,
    bottom: 0,
    width: collapsed ? "70px" : "250px",
    backgroundColor: "#212529",
    color: "white",
    paddingTop: `${topNavbarHeight}px`, // Updated to match header
    overflowY: "auto",
    transition: "width 0.4s ease-in-out",
    boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
  };

  const navLinkStyle = (path) => ({
    color: activeLink === path ? "#0d6efd" : "white",
    textDecoration: "none",
    padding: "0.5rem",
    display: "flex",
    alignItems: "center",
    borderRadius: "4px",
    fontWeight: activeLink === path ? "bold" : "normal",
    backgroundColor: activeLink === path ? "rgba(255,255,255,0.1)" : "transparent",
    transition: "background-color 0.4s, color 0.3s",
  });

  const contentWrapperStyle = {
    display: "flex",
    flex: "1 1 auto",
    flexWrap: "nowrap",
  };

  const mainContentStyle = {
    marginTop: `${topNavbarHeight}px`, // Updated to match header
    padding: "1.5rem",
    overflowY: "auto",
    marginLeft: collapsed ? "70px" : "250px",
    transition: "margin-left 0.4s ease-in-out",
    width: "100%",
    minHeight: `calc(100vh - ${topNavbarHeight}px)`, // Updated to match header
  };

  const menuItems = [
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
      <style>{`
        html, body, #root {
          margin: 0;
          padding: 0;
          height: 100%;
          background-color: #212529;
        }

        .sidebar-text {
          transition: opacity 0.3s ease-in-out;
        }

        .sidebar-text.hidden {
          opacity: 0;
          pointer-events: none;
        }

        /* 🌈 Background Animation */
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animated-bg {
          background: linear-gradient(135deg, #f0f8ff, #e0f7fa, #f0f8ff);
          background-size: 200% 200%;
          animation: gradientMove 18s ease infinite;
          border-radius: 12px;
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
          <span className="fw-bold d-flex align-items-center">
            <button
              className="btn btn-sm btn-light me-3"
              onClick={toggleSidebar}
              title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <i className="bi bi-list"></i>
            </button>
            🎓 LMS Student
          </span>
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

        {/* Content Area */}
        <div style={contentWrapperStyle}>
          {/* Sidebar */}
          <aside style={sidebarStyle}>
            <h5
              className={`text-center mb-4 sidebar-text ${collapsed ? "hidden" : ""}`}
            >
              <i className="bi bi-mortarboard-fill me-2"></i> Student Panel
            </h5>
            <ul className="nav flex-column gap-2">
              {menuItems.map((item, idx) => (
                <li className="nav-item" key={idx}>
                  <Link
                    to={item.to}
                    onClick={() => setActiveLink(item.to)}
                    style={navLinkStyle(item.to)}
                    className="nav-link"
                  >
                    <i className={`bi bi-${item.icon} me-2`}></i>
                    {!collapsed && (
                      <span className="sidebar-text">{item.label}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          {/* Main Content */}
          <main style={mainContentStyle} className="animated-bg">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}

export default StudentDashboard;
