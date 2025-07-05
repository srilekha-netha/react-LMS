import React, { useState, useEffect } from "react";
import axios from "axios";

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

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser && storedUser.name && storedUser.email) {
      setProfile({
        name: storedUser.name || "",
        email: storedUser.email || "",
        bio: storedUser.bio || "",
        expertise: storedUser.expertise || "",
      });
    }
  }, []);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

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
      await axios.post(
        `http://localhost:5000/api/users/${user._id}/change-password`,
        {
          oldPassword: currentPassword,
          newPassword,
        }
      );

      setMessage("🔐 Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError("❌ Password change failed.");
    }
  };

  return (
    <div className="container my-4">
      <div className="row g-4">
        {/* Profile Update Card */}
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-person-circle me-2"></i>Update Profile
              </h5>
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

                <div className="mb-3">
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
                    <i className="bi bi-save me-1"></i>Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-header bg-warning text-dark">
              <h5 className="mb-0">
                <i className="bi bi-lock me-2"></i>Change Password
              </h5>
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

                <div className="mb-3">
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
                    <i className="bi bi-shield-lock me-1"></i>Change
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
