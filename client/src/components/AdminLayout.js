// AdminLayout.js
import React, { useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import "./AdminLayout.css";

export default function AdminLayout() {
  const location = useLocation();

  // load Font-Awesome for footer icons
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
    document.head.appendChild(link);
  }, []);

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
    <>
      {/* Fixed header */}
      <nav className="admin-navbar">
        <span className="logo-title">Forge IT LMS</span>
        <Link to="/admin/logout" className="btn btn-outline-light btn-sm">
          <i className="bi bi-box-arrow-right me-1" /> Logout
        </Link>
      </nav>

      {/* Sidebar + Main */}
      <div className="admin-body">
        <aside className="admin-sidebar">
          <h5 className="sidebar-title">
            <i className="bi bi-tools me-2" /> Admin Menu
          </h5>
          <ul className="sidebar-nav">
            {navItems.map(item => (
              <li
                key={item.to}
                className={location.pathname === item.to ? "active" : ""}
              >
                <Link to={item.to} className="sidebar-link">
                  <i className={`bi bi-${item.icon} sidebar-icon`} />
                  <span className="sidebar-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="admin-footer">
        <div className="footer-icons">
          <a
            href="https://instagram.com/yourorg"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-social"
          >
            <i className="fa fa-instagram" />
          </a>
          <a
            href="https://t.me/yourorg"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-social"
          >
            <i className="fa fa-telegram" />
          </a>
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-social"
          >
            <i className="fa fa-whatsapp" />
          </a>
        </div>
        <p className="small">
          © {new Date().getFullYear()} Forge IT LMS. All rights reserved.
        </p>
      </footer>
    </>
  );
}
