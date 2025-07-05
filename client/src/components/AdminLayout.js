import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import "./AdminLayout.css";

function AdminLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { to: "/admin", icon: "speedometer2", label: "Dashboard" },
    { to: "/admin/users", icon: "people-fill", label: "User Management" },
    { to: "/admin/courses", icon: "journal-bookmark-fill", label: "Course Management" },
    { to: "/admin/teachers/onboarding", icon: "person-badge", label: "Teacher Onboarding" },
    { to: "/admin/payments", icon: "wallet", label: "Payments" },
    { to: "/admin/reports", icon: "graph-up", label: "Reports" },
    { to: "/admin/coupons", icon: "ticket-perforated", label: "Coupons" },
  ];

  return (
    <div className="admin-dashboard-wrapper">
      <nav className="admin-navbar">
        {/* Left side: collapse toggle + title */}
        <div className="navbar-left">
          <button
            className="btn btn-sm btn-light sidebar-toggle-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            <i className={`bi bi-${collapsed ? "chevron-right" : "chevron-left"}`}></i>
          </button>
          <span className="fw-bold logo-title">Admin Panel</span>
        </div>

        {/* Right side: logout */}
        <div className="navbar-right">
          <Link to="/admin/logout" className="btn btn-outline-light btn-sm admin-logout-btn">
            <i className="bi bi-box-arrow-right me-1" /> Logout
          </Link>
        </div>
      </nav>

      <div className={`admin-main-content ${collapsed ? "sidebar-collapsed" : ""}`}>
        <aside className="admin-sidebar">
          <h5 className="sidebar-title">
            <i className="bi bi-tools me-2" /> Admin Menu
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
                  <span className="sidebar-icon">
                    <i className={`bi bi-${item.icon}`}></i>
                  </span>
                  <span className="sidebar-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <div className="admin-page-with-footer">
          <main className="admin-page-content">
            <div className="container-fluid">
              <Outlet />
            </div>
          </main>
          <footer className="admin-footer">
            © {new Date().getFullYear()} Your Company Name
          </footer>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
