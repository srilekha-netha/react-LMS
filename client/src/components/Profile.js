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
  }, []);

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
    <div className="container py-5" style={{ minHeight: "90vh" }}>
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="row g-4">
            {/* Left Box - Profile Info */}
            <div className="col-md-6">
              <div className="card border-0 shadow rounded-4 h-100">
                <div className="card-header bg-primary text-white rounded-top-4">
                  <h5 className="mb-0">
                    <i className="bi bi-person-circle me-2"></i> Personal Profile
                  </h5>
                </div>
                <div className="card-body bg-light rounded-bottom-4">
                  {message && <div className="alert alert-success">{message}</div>}
                  {error && <div className="alert alert-danger">{error}</div>}

                  <form onSubmit={handleUpdateProfile}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Name</label>
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
                      <label className="form-label fw-semibold">Email</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={profile.email}
                        readOnly
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Bio</label>
                      <textarea
                        name="bio"
                        className="form-control"
                        rows="3"
                        value={profile.bio}
                        onChange={handleChange}
                      ></textarea>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold">Expertise</label>
                      <input
                        type="text"
                        name="expertise"
                        className="form-control"
                        value={profile.expertise}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="text-end">
                      <button type="submit" className="btn btn-success px-4">
                        <i className="bi bi-save me-1"></i> Update
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Right Box - Password Change */}
            <div className="col-md-6">
              <div className="card border-0 shadow rounded-4 h-100">
                <div className="card-header bg-warning text-dark rounded-top-4">
                  <h5 className="mb-0">
                    <i className="bi bi-lock-fill me-2"></i> Change Password
                  </h5>
                </div>
                <div className="card-body bg-light rounded-bottom-4">
                  <form onSubmit={handlePasswordChange}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Current Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold">Confirm New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="text-end">
                      <button type="submit" className="btn btn-dark px-4">
                        <i className="bi bi-arrow-repeat me-1"></i> Change
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            {/* End row */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
