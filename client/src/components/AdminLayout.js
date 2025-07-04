import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import "./StudentDashboard.css";

function AdminLayout() {
  const location = useLocation();

  const navItems = [
    { to: "/admin", icon: "speedometer2", label: "Dashboard" },
    { to: "/admin/users", icon: "people-fill", label: "User Management" },
    { to: "/admin/courses", icon: "journal-bookmark-fill", label: "Course Management" },
     { to: "/admin/teachers/onboarding", icon: "person-badge", label: "Teacher Onboarding" },
    { to: "/admin/payments", icon: "wallet", label: "Payments" },
    { to: "/admin/reports", icon: "graph-up", label: "Reports" },
    { to: "/admin/coupons", icon: "ticket-perforated", label: "Coupons" },
    { to: "/admin/settings", icon: "gear", label: "Settings" },
    { to: "/admin/logs", icon: "shield-lock", label: "Logs" },
    { to: "/admin/profile", icon: "person-circle", label: "Profile" },
  ];

  return (
    <div className="teacher-dashboard-wrapper">
      <nav className="teacher-navbar">
        <span className="fw-bold logo-title">🛠️ Admin Panel</span>
        <div className="d-flex align-items-center gap-4">
          <Link to="/admin/logout" className="btn btn-outline-light btn-sm teacher-logout-btn">
            <i className="bi bi-box-arrow-right me-1"></i> Logout
          </Link>
        </div>
      </nav>

      <div className="teacher-main-content">
        <aside className="teacher-sidebar">
          <h5 className="sidebar-title">
            <i className="bi bi-tools me-2"></i> Admin Menu
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

        <main className="teacher-page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
