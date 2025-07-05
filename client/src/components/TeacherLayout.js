import "./StudentDashboard.css";
import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

function TeacherLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed(!collapsed);

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
        <nav className="teacher-navbar d-flex justify-content-between align-items-center px-3">
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-sm btn-outline-light d-none d-md-inline"
              onClick={toggleSidebar}
            >
              <i className="bi bi-list" style={{ fontSize: '1.3rem' }}></i>
            </button>
            <span className="fw-bold logo-title mb-0">📘 LMS</span>
          </div>

          <div className="d-flex align-items-center gap-4">
            <span className="teacher-nav-user">
              <i className="bi bi-person-circle me-2"></i> Teacher
            </span>
            <Link to="/teacher/notifications" className="teacher-nav-link">
              <i className="bi bi-bell-fill me-1"></i>{" "}
              <span className="d-none d-md-inline">Notifications</span>
            </Link>
            <Link to="/teacher/logout" className="btn btn-outline-light btn-sm ms-1 teacher-logout-btn">
              <i className="bi bi-box-arrow-right me-1"></i> Logout
            </Link>
          </div>
        </nav>

        {/* Main Layout */}
        <div className={`teacher-main-content ${collapsed ? "sidebar-collapsed" : ""}`}>
          {/* Sidebar */}
          <aside className={`teacher-sidebar ${collapsed ? "collapsed" : ""}`}>
            <h5 className="sidebar-title">
              <i className="bi bi-person-workspace me-2"></i> Teacher Panel
            </h5>
            <ul className="sidebar-nav">
              {navItems.map((item) => (
                <li
                  className={`sidebar-nav-item ${location.pathname.startsWith(item.to) ? "active" : ""}`}
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
        {/* Footer */}
 {/* Footer */}
<footer className="student-footer  text-light pt-5 pb-3" style={{ backgroundColor: "dark #0d1b2a" }}>
  <div className="container">
    <div className="row">
      <div className="col-md-3 mb-4">
        <h5 className="fw-bold text-white">LMS</h5>
        <p>Achieve your goals with LMS Student Portal.</p>
        <button className="btn btn-light btn-sm">Start Free Trial</button>
        <p className="mt-2"><strong>₹999/month</strong>, cancel anytime</p>
      </div>

      <div className="col-md-2 mb-3">
        <h6 className="fw-bold text-white">LMS</h6>
        <ul className="list-unstyled">
          <li><button className="btn text-light p-0">About</button></li>
          <li><button className="btn text-light p-0">Courses</button></li>
          <li><button className="btn text-light p-0">Certificates</button></li>
          <li><button className="btn text-light p-0">Pricing</button></li>
        </ul>
      </div>

      <div className="col-md-2 mb-3">
        <h6 className="fw-bold text-white">Community</h6>
        <ul className="list-unstyled">
          <li><button className="btn text-light p-0">Learners</button></li>
          <li><button className="btn text-light p-0">Partners</button></li>
          <li><button className="btn text-light p-0">Blog</button></li>
        </ul>
      </div>

      <div className="col-md-2 mb-3">
        <h6 className="fw-bold text-white">Support</h6>
        <ul className="list-unstyled">
          <li><button className="btn text-light p-0">Contact</button></li>
          <li><button className="btn text-light p-0">Help Center</button></li>
          <li><button className="btn text-light p-0">Terms</button></li>
          <li><button className="btn text-light p-0">Privacy</button></li>
        </ul>
      </div>

      <div className="col-md-3 mb-3 text-center text-md-start">
        <h6 className="fw-bold text-white">Get Our App</h6>

        <div className="d-flex gap-3 justify-content-center justify-content-md-start mb-3">
          <button type="button" className="btn btn-link text-white fs-4 p-0 m-0">
            <i className="fa fa-instagram"></i>
          </button>
          <br></br>
          <button type="button" className="btn btn-link text-white fs-4 p-0 m-0">
            <i className="fa fa-telegram"></i>
          </button>
          <br></br>
          <button type="button" className="btn btn-link text-white fs-4 p-0 m-0">
            <i className="fa fa-whatsapp"></i>
          </button>
        </div>

        <div className="d-flex flex-column align-items-center align-items-md-start">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
            alt="Google Play"
            height="40"
          />
        </div>
      </div>
    </div>

    <hr className="border-top border-light" />

    <div className="text-center text-light small">
      © {new Date().getFullYear()} LMS Student Dashboard. All rights reserved.
    </div>
  </div>
</footer>
      </div>
    </>
  );
}

export default TeacherLayout;
