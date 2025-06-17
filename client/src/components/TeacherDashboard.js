import React from "react";

const TeacherDashboard = () => {
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
        <div className="d-flex flex-column" style={{ backdropFilter: "brightness(0.9)", minHeight: "100vh" }}>
          {/* Top Navbar */}
          <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
            <span className="navbar-brand fw-bold">📘 LMS</span>
            <div className="ms-auto d-flex align-items-center gap-3 text-white">
              <span><i className="bi bi-bell-fill me-1"></i> Notifications</span>
              <span><i className="bi bi-person-circle me-1"></i> Teacher</span>
              <button className="btn btn-outline-light btn-sm">
                <i className="bi bi-box-arrow-right me-1"></i> Logout
              </button>
            </div>
          </nav>

          <div className="d-flex flex-grow-1">
            {/* Sidebar */}
            <aside className="bg-dark text-white p-4" style={{ width: "250px", opacity: 0.95 }}>
              <h5 className="text-center mb-4">Teacher Panel</h5>
              <nav className="nav flex-column">
                <a href="#" className="nav-link text-white mb-2">
                  <i className="bi bi-house-door-fill me-2"></i> Dashboard
                </a>
                <a href="#" className="nav-link text-white mb-2">
                  <i className="bi bi-journal-bookmark me-2"></i> Courses
                </a>
                <a href="#" className="nav-link text-white mb-2">
                  <i className="bi bi-plus-square me-2"></i> Create Course
                </a>
                <a href="#" className="nav-link text-white mb-2">
                  <i className="bi bi-clipboard-check me-2"></i> Assignments
                </a>
                <a href="#" className="nav-link text-white mb-2">
                  <i className="bi bi-people me-2"></i> Students
                </a>
                <a href="#" className="nav-link text-white mb-2">
                  <i className="bi bi-chat-left-dots me-2"></i> Messages
                </a>
                <a href="#" className="nav-link text-white mb-2">
                  <i className="bi bi-person me-2"></i> Profile
                </a>
              </nav>
            </aside>

            {/* Main content */}
            <main className="flex-grow-1 p-4 bg-light bg-opacity-75">
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
