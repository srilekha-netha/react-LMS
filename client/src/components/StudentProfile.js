import React, { useState, useRef } from "react";
import "./StudentDashboard.css";

function StudentProfile() {
  const [profile, setProfile] = useState({
    name: "Meghana",
    email: "meghana@example.com",
    phone: "9876543210",
    password: "",
    confirmPassword: "",
    notifications: true,
    image: null,
  });

  const fileInputRef = useRef(null); // 👈 Reference to hidden file input

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setProfile({ ...profile, [name]: checked });
    } else if (type === "file") {
      setProfile({ ...profile, image: URL.createObjectURL(files[0]) });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click(); // 👈 Triggers file picker
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  return (
    <div className="profile-container">
      <h2 className="text-success mb-4">👤 My Profile & Settings</h2>
      <form onSubmit={handleSubmit} className="shadow-sm p-4 bg-white rounded">

        <div className="text-center mb-4">
          <img
            src={profile.image || "https://via.placeholder.com/120"}
            alt="Profile"
            className="profile-pic"
            onClick={handleImageClick}
            title="Click to change"
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            name="image"
            style={{ display: "none" }}
            onChange={handleChange}
          />
          <small className="text-muted d-block mt-2">Click the image to change profile photo</small>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={profile.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={profile.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-control"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <hr className="my-4" />

        <h5 className="text-secondary">🔐 Change Password</h5>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={profile.password}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              className="form-control"
              name="confirmPassword"
              value={profile.confirmPassword}
              onChange={handleChange}
            />
          </div>
        </div>

        <hr className="my-4" />

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            name="notifications"
            checked={profile.notifications}
            onChange={handleChange}
            id="notifications"
          />
          <label className="form-check-label" htmlFor="notifications">
            Enable Email Notifications
          </label>
        </div>

        <div className="text-end">
          <button type="submit" className="btn btn-success px-4">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default StudentProfile;
