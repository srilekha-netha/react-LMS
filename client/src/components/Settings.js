// src/components/Settings.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentDashboard.css"; // responsive styles

// Fake fallback settings
const fakeSettings = {
  siteTitle: "My LMS Platform",
  logoUrl: "https://via.placeholder.com/150x50?text=Logo",
  razorpayKey: "rzp_test_1234567890",
  stripeKey: "pk_test_abcdefghijklmnopqrstuvwxyz",
  defaultRole: "student",
  supportEmail: "support@lmsplatform.com",
  enableCourseApproval: true,
  enableChat: true,
};

function Settings() {
  const [settings, setSettings] = useState(fakeSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/admin/settings")
      .then((res) => {
        setSettings(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading settings", err);
        // use fakeSettings fallback
        setSettings(fakeSettings);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put("/api/admin/settings", settings)
      .then(() => alert("Settings updated successfully"))
      .catch((err) => {
        console.error("Update failed", err);
        alert("Failed to update settings, using fallback values.");
      });
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">⚙️ System Settings</h3>

      {loading ? (
        <p>Loading settings...</p>
      ) : (
        <form onSubmit={handleSubmit} className="row g-3">
          {/* Site Title */}
          <div className="col-12 col-md-6">
            <label className="form-label">Site Title</label>
            <input
              type="text"
              name="siteTitle"
              className="form-control"
              value={settings.siteTitle}
              onChange={handleChange}
              required
            />
          </div>

          {/* Logo URL */}
          <div className="col-12 col-md-6">
            <label className="form-label">Logo URL</label>
            <input
              type="url"
              name="logoUrl"
              className="form-control"
              value={settings.logoUrl}
              onChange={handleChange}
              required
            />
          </div>

          {/* Razorpay Key */}
          <div className="col-12 col-md-6">
            <label className="form-label">Razorpay Key</label>
            <input
              type="text"
              name="razorpayKey"
              className="form-control"
              value={settings.razorpayKey}
              onChange={handleChange}
            />
          </div>

          {/* Stripe Key */}
          <div className="col-12 col-md-6">
            <label className="form-label">Stripe Key</label>
            <input
              type="text"
              name="stripeKey"
              className="form-control"
              value={settings.stripeKey}
              onChange={handleChange}
            />
          </div>

          {/* Default Role */}
          <div className="col-12 col-md-4">
            <label className="form-label">Default Role</label>
            <select
              className="form-select"
              name="defaultRole"
              value={settings.defaultRole}
              onChange={handleChange}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Support Email */}
          <div className="col-12 col-md-4">
            <label className="form-label">Support Email</label>
            <input
              type="email"
              name="supportEmail"
              className="form-control"
              value={settings.supportEmail}
              onChange={handleChange}
              required
            />
          </div>

          {/* Feature Toggles */}
          <div className="col-12 col-md-4 d-flex flex-column flex-md-row align-items-start mt-3">
            <div className="form-check me-4">
              <input
                className="form-check-input"
                type="checkbox"
                id="enableCourseApproval"
                name="enableCourseApproval"
                checked={settings.enableCourseApproval}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="enableCourseApproval">
                Enable Course Approval
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="enableChat"
                name="enableChat"
                checked={settings.enableChat}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="enableChat">
                Enable Chat
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="col-12 text-end mt-3">
            <button className="btn btn-primary">
              <i className="bi bi-save me-1"></i> Save Settings
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Settings;
