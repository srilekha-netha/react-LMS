// src/components/AdminLayout.js
import React from "react";
import { Outlet, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function AdminLayout() {
  return (
    <div className="vh-100 vw-100 d-flex flex-column overflow-hidden">
      {/* Top Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow-sm">
        <span className="navbar-brand d-flex align-items-center gap-2">
          <i className="bi bi-speedometer2 fs-4"></i>
          <span className="fs-5">Admin Panel</span>
        </span>
        <div className="ms-auto d-flex align-items-center gap-3">
          <Link to="/admin/settings" className="text-white" title="Settings">
            <i className="bi bi-gear-fill fs-5"></i>
          </Link>
          <Link to="/" className="btn btn-outline-light btn-sm">
            Logout
          </Link>
        </div>
      </nav>

      {/* Body Layout */}
      <div className="d-flex flex-grow-1 h-100 overflow-hidden">
        {/* Sidebar */}
        <aside
          className="bg-dark text-white p-3 d-flex flex-column"
          style={{ width: "250px", overflowY: "auto" }}
        >
          <nav className="nav flex-column">
            <Link to="/admin" className="nav-link text-white mb-2">
              <i className="bi bi-house-door-fill me-2"></i> Dashboard
            </Link>
            <Link to="/admin/users" className="nav-link text-white mb-2">
              <i className="bi bi-people-fill me-2"></i> User Management
            </Link>
            <Link to="/admin/courses" className="nav-link text-white mb-2">
              <i className="bi bi-journal-bookmark-fill me-2"></i> Course Management
            </Link>
            <Link to="/admin/payments" className="nav-link text-white mb-2">
              <i className="bi bi-currency-dollar me-2"></i> Payment Management
            </Link>
            <Link to="/admin/reports" className="nav-link text-white mb-2">
              <i className="bi bi-graph-up me-2"></i> Reports & Analytics
            </Link>
            <Link to="/admin/coupons" className="nav-link text-white mb-2">
              <i className="bi bi-ticket-perforated-fill me-2"></i> Coupons
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-grow-1 bg-light p-4 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
