import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import "./AdminLayout.css";

function AdminLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  React.useEffect(() => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
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
  ];

  return React.createElement(
    "div",
    { className: "teacher-dashboard-wrapper" },
    // Top navbar
    React.createElement(
      "nav",
      { className: "teacher-navbar" },
      React.createElement("span", { className: "fw-bold logo-title", children: "🛠️ Admin Panel" }),
      React.createElement(
        "div",
        { className: "d-flex align-items-center gap-4" },
        React.createElement(
          Link,
          { to: "/admin/logout", className: "btn btn-outline-light btn-sm teacher-logout-btn" },
          React.createElement("i", { className: "bi bi-box-arrow-right me-1" }),
          "Logout"
        )
      )
    ),

    // Sidebar and main content
    React.createElement(
      "div",
      { className: "d-flex" },
      React.createElement(
        "aside",
        { className: "teacher-sidebar" },
        React.createElement(
          "h5",
          { className: "sidebar-title" },
          React.createElement("i", { className: "bi bi-tools me-2" }),
          "Admin Menu"
        ),
        React.createElement(
          "ul",
          { className: "sidebar-nav" },
          navItems.map((item) =>
            React.createElement(
              "li",
              {
                key: item.to,
                className: `sidebar-nav-item ${location.pathname === item.to ? "active" : ""}`,
              },
              React.createElement(
                Link,
                { to: item.to, className: "sidebar-link" },
                React.createElement("span", { className: "sidebar-icon" }, React.createElement("i", { className: `bi bi-${item.icon}` })),
                React.createElement("span", { className: "sidebar-label", children: item.label })
              )
            )
          )
        )
      ),

      React.createElement(
        "main",
        { className: "teacher-page-content" },
        React.createElement(Outlet, null)
      )
    ),

    // Footer
    React.createElement(
      "footer",
      {
        className: "student-footer text-light pt-5 pb-3",
        style: { backgroundColor: "#192038" },
      },
      React.createElement(
        "div",
        { className: "container" },
        React.createElement(
          "div",
          { className: "row" },

          // LMS info
          React.createElement(
            "div",
            { className: "col-md-3 mb-4" },
            React.createElement("h5", { className: "fw-bold text-white", children: "Forge LMS" }),
            React.createElement("p", null, "Achieve your goals with LMS Admin Portal."),
            React.createElement("button", { className: "btn btn-light btn-sm", children: "Start Free Trial" }),
            React.createElement("p", { className: "mt-2" },
              React.createElement("strong", null, "₹999/month"), ", cancel anytime"
            )
          ),

          // LMS links
          React.createElement(
            "div",
            { className: "col-md-2 mb-3" },
            React.createElement("h6", { className: "fw-bold text-white", children: "LMS" }),
            React.createElement(
              "ul",
              { className: "list-unstyled" },
              ["About", "Courses", "Certificates", "Pricing"].map((text) =>
                React.createElement(
                  "li",
                  null,
                  React.createElement("button", { className: "btn text-light p-0", children: text })
                )
              )
            )
          ),

          // Community links
          React.createElement(
            "div",
            { className: "col-md-2 mb-3" },
            React.createElement("h6", { className: "fw-bold text-white", children: "Community" }),
            React.createElement(
              "ul",
              { className: "list-unstyled" },
              ["Learners", "Partners", "Blog"].map((text) =>
                React.createElement(
                  "li",
                  null,
                  React.createElement("button", { className: "btn text-light p-0", children: text })
                )
              )
            )
          ),

          // Support links
          React.createElement(
            "div",
            { className: "col-md-2 mb-3" },
            React.createElement("h6", { className: "fw-bold text-white", children: "Support" }),
            React.createElement(
              "ul",
              { className: "list-unstyled" },
              ["Contact", "Help Center", "Terms", "Privacy"].map((text) =>
                React.createElement(
                  "li",
                  null,
                  React.createElement("button", { className: "btn text-light p-0", children: text })
                )
              )
            )
          ),

          // App section
          React.createElement(
            "div",
            { className: "col-md-3 mb-3 text-center text-md-start" },
            React.createElement("h6", { className: "fw-bold text-white", children: "Get Our App" }),
            React.createElement(
              "div",
              { className: "d-flex gap-3 justify-content-center justify-content-md-start mb-3" },
              ["instagram", "telegram", "whatsapp"].map((icon) =>
                React.createElement(
                  "button",
                  { type: "button", className: "btn btn-link text-white fs-4 p-0 m-0" },
                  React.createElement("i", { className: `fa fa-${icon}` })
                )
              )
            ),
            React.createElement(
              "div",
              { className: "d-flex flex-column align-items-center align-items-md-start" },
              React.createElement("img", {
                src: "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg",
                alt: "Google Play",
                height: "40",
              })
            )
          )
        ),
        React.createElement("hr", { className: "border-top border-light" }),
        React.createElement(
          "div",
          { className: "text-center text-light small" },
          `© ${new Date().getFullYear()} LMS Admin Dashboard. All rights reserved.`
        )
      )
    )
  );
}

export default AdminLayout;
