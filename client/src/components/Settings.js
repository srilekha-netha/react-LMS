import React, { useEffect, useState } from "react";
import axios from "axios";

function Settings() {
  const [settings, setSettings] = useState({
    siteTitle: "",
    logoUrl: "",
    razorpayKey: "",
    stripeKey: "",
    defaultRole: "student",
    supportEmail: "",
    enableCourseApproval: true,
    enableChat: true,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/admin/settings")
      .then(res => {
        setSettings(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading settings", err);
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
      .catch((err) => console.error("Update failed", err));
  };

  return (
    <div className="container mt-4">
      <h3>⚙️ System Settings</h3>

      {loading ? (
        <p>Loading settings...</p>
      ) : (
        <form onSubmit={handleSubmit} className="row g-3 mt-3">
          <div className="col-md-6">
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

          <div className="col-md-6">
            <label className="form-label">Logo URL</label>
            <input
              type="text"
              name="logoUrl"
              className="form-control"
              value={settings.logoUrl}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Razorpay Key</label>
            <input
              type="text"
              name="razorpayKey"
              className="form-control"
              value={settings.razorpayKey}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Stripe Key</label>
            <input
              type="text"
              name="stripeKey"
              className="form-control"
              value={settings.stripeKey}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
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

          <div className="col-md-4">
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

          <div className="col-md-4 d-flex align-items-end">
            <div className="form-check me-3">
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

          <div className="col-12 text-end">
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
