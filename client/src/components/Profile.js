import React, { useState, useEffect } from "react";
import axios from "axios";
import './TeacherLayout.css';

function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    expertise: "",
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (user && user.name && user.email) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        expertise: user.expertise || "",
      });
    }
  }, [user]); // ✅ Fix: Added `user` to dependency array

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await axios.put(`http://localhost:5000/api/users/${user._id}`, {
        name: profile.name,
        bio: profile.bio,
        expertise: profile.expertise,
      });

      setMessage("✅ Profile updated successfully!");
    } catch (err) {
      setError("❌ Failed to update profile.");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      return setError("❌ New password and confirm password do not match.");
    }

    try {
      await axios.post(`http://localhost:5000/api/users/${user._id}/change-password`, {
        oldPassword: currentPassword,
        newPassword,
      });

      setMessage("🔐 Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError("❌ Password change failed.");
    }
  };

return (
  <div className="admin-content">
    <div className="profile-container">

      {/* Left Box - Profile Info */}
      <div className="profile-box">
        <div className="card-header bg-primary text-white">
          <i className="bi bi-person-circle me-2"></i> Personal Profile
        </div>
        <div className="card-body">
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleUpdateProfile}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={profile.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={profile.email}
                readOnly
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Bio</label>
              <textarea
                name="bio"
                className="form-control"
                rows="3"
                value={profile.bio}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="form-label">Expertise</label>
              <input
                type="text"
                name="expertise"
                className="form-control"
                value={profile.expertise}
                onChange={handleChange}
              />
            </div>

            <div className="text-end">
              <button type="submit" className="btn btn-success">
                <i className="bi bi-save me-1"></i> Update
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Box - Password Change */}
      <div className="profile-box">
        <div className="card-header bg-warning text-dark">
          <i className="bi bi-lock-fill me-2"></i> Change Password
        </div>
        <div className="card-body">
          <form onSubmit={handlePasswordChange}>
            <div className="mb-3">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-control"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="text-end">
              <button type="submit" className="btn btn-dark">
                <i className="bi bi-arrow-repeat me-1"></i> Change
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  </div>
);

}

export default Profile;
