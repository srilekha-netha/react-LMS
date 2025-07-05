import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import "./StudentDashboard.css";

function StudentDashboard() {
  const location = useLocation();

  // Fetch the student's name from localStorage
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

      <div className="teacher-dashboard-wrapper">
        {/* Top Navbar */}
        <nav className="teacher-navbar">
          <span className="fw-bold logo-title">🎓 LMS Student</span>
          <div className="d-flex align-items-center gap-4">
            <span className="teacher-nav-user">
              <i className="bi bi-person-circle me-2"></i> {studentName}
            </span>
            <Link to="/student/notifications" className="teacher-nav-link">
              <i className="bi bi-bell-fill me-1"></i>
              <span className="d-none d-md-inline">Notifications</span>
            </Link>
            <Link to="/student/logout" className="btn btn-outline-light btn-sm teacher-logout-btn">
              <i className="bi bi-box-arrow-right me-1"></i> Logout
            </Link>
          </div>
        </nav>

        {/* Layout Body */}
        <div className="teacher-main-content">
          {/* Sidebar */}
          <aside className="teacher-sidebar">
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

          {/* Page Content */}
          <main className="teacher-page-content">
            <Outlet />
          </main>
        </div>

        {/* Footer */}
        <footer className="student-footer text-light pt-5 pb-3" style={{ backgroundColor: "#192038" }}>
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
                  <button type="button" className="btn btn-link text-white fs-4 p-0 m-0">
                    <i className="fa fa-telegram"></i>
                  </button>
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

export default StudentDashboard;
