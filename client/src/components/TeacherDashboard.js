import React, { useState } from "react";
import { Link } from "react-router-dom";

const TeacherDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <>
      {/* Bootstrap CSS & Icons CDN */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
        rel="stylesheet"
      />

      {/* Background Wrapper */}
      <div
        style={{
          backgroundImage: "url('/teacher-bg.jpg')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          minHeight: "100vh",
          
        }}
        
      >
        <div
          className="d-flex flex-column"
          style={{ backdropFilter: "brightness(0.9)", minHeight: "100vh" }}
        >
          {/* Top Navbar */}
<nav className="navbar navbar-expand-lg navbar-dark px-4" style={{ backgroundColor: "#0d1b2a" }}>
            <span className="navbar-brand fw-bold">📘 LMS</span>

            <button
              onClick={toggleSidebar}
              className="btn btn-outline-light btn-sm ms-3"
              title="Toggle Sidebar"
            >
              <i className="bi bi-list"></i>
            </button>

            <div className="ms-auto d-flex align-items-center gap-3 text-white">
              <span>
                <i className="bi bi-bell-fill me-1"></i> Notifications
              </span>
              <span>
                <i className="bi bi-person-circle me-1"></i> Teacher
              </span>
              <button className="btn btn-outline-light btn-sm">
                <i className="bi bi-box-arrow-right me-1"></i> Logout
              </button>
            </div>
          </nav>

          <div className="d-flex flex-grow-1">
            {/* Sidebar */}
            <aside
              className={`bg-dark text-white p-3 d-flex flex-column align-items-${
                collapsed ? "center" : "start"
              } transition`}
              style={{
                width: collapsed ? "70px" : "250px",
                transition: "width 0.3s ease",
                overflow: "hidden",
              }}
            >
              <h5
                className={`text-center mb-4 ${
                  collapsed ? "d-none" : ""
                }`}
              >
                Teacher Panel
              </h5>
              <nav className="nav flex-column w-100">
                <SidebarLink
                  to="/teacher/dashboard"
                  icon="bi-house-door-fill"
                  label="Dashboard"
                  collapsed={collapsed}
                />
                <SidebarLink
                  to="/teacher/courses"
                  icon="bi-journal-bookmark"
                  label="Courses"
                  collapsed={collapsed}
                />
                <SidebarLink
                  to="/teacher/create-course"
                  icon="bi-plus-square"
                  label="Create Course"
                  collapsed={collapsed}
                />
                <SidebarLink
                  to="/teacher/assignments"
                  icon="bi-clipboard-check"
                  label="Assignments"
                  collapsed={collapsed}
                />
                <SidebarLink
                  to="/teacher/students"
                  icon="bi-people"
                  label="Students"
                  collapsed={collapsed}
                />
                <SidebarLink
                  to="/teacher/messages"
                  icon="bi-chat-left-dots"
                  label="Messages"
                  collapsed={collapsed}
                />
                <SidebarLink
                  to="/teacher/profile"
                  icon="bi-person"
                  label="Profile"
                  collapsed={collapsed}
                />
              </nav>
            </aside>

            {/* Main Content */}
<main
  className="p-4 bg-light bg-opacity-75"
  style={{
    marginLeft: collapsed ? "70px" : "250px",
    transition: "margin-left 0.3s ease",
    width: "100%",
    minHeight: "calc(100vh - 56px)",
  }}
>
              <h2 className="mb-4">Welcome, Teacher 👋</h2>
              <div className="row g-4">
                <DashboardCard
                  title="My Courses"
                  icon="bi bi-journal-bookmark-fill"
                  desc="View or manage your courses"
                  color="primary"
                />
                <DashboardCard
                  title="Assignments"
                  icon="bi bi-clipboard-check-fill"
                  desc="Create and check assignments"
                  color="success"
                />
                <DashboardCard
                  title="Messages"
                  icon="bi bi-chat-dots-fill"
                  desc="Communicate with students"
                  color="info"
                />
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

// Reusable Sidebar Link component
const SidebarLink = ({ to, icon, label, collapsed }) => (
  <Link
    to={to}
    className="nav-link text-white mb-2 d-flex align-items-center"
  >
    <i className={`bi ${icon} me-2 fs-5`}></i>
    <span className={`sidebar-text ${collapsed ? "hidden" : ""}`}>{label}</span>
  </Link>
);

// Dashboard card
const DashboardCard = ({ title, icon, desc, color }) => (
  <div className="col-md-4">
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body">
        <h5 className="card-title d-flex align-items-center mb-3">
          <i className={`${icon} text-${color} fs-4 me-3`}></i>
          {title}
        </h5>
        <p className="card-text">{desc}</p>
        <button className={`btn btn-outline-${color} btn-sm`}>Go</button>
      </div>
    </div>
  </div>
);

export default TeacherDashboard;
