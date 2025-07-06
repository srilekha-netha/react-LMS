import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentDashboard.css";

function StudentProfile() {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [edit, setEdit] = useState(false);
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    axios.get(`http://localhost:5000/api/users/${user._id}`).then((res) => setProfile(res.data));
  }, []);

  const handleEdit = () => setEdit(true);

  const handleSave = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const res = await axios.put(`http://localhost:5000/api/users/${user._id}`, profile);
    setProfile(res.data);
    setEdit(false);
    setMsg("✅ Profile updated successfully!");
    setTimeout(() => setMsg(""), 3000);
  };

  const handlePasswordChange = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      await axios.post(`http://localhost:5000/api/users/${user._id}/change-password`, passwords);
      setMsg("🔒 Password changed!");
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch (err) {
      setMsg(err.response?.data?.message || "❌ Error changing password");
    }
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="profile-container">
      <h2 className="fade-in">👤 Profile & Settings</h2>
      <br />
      <div className="grid-container fade-in">
        <div className="profile-card">
          <div className="info-box">
            <label>Name:</label>
            {edit ? (
              <input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            ) : (
              <span>{profile.name}</span>
            )}
          </div>

          <div className="info-box">
            <label>Email:</label>
            {edit ? (
              <input
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            ) : (
              <span>{profile.email}</span>
            )}
          </div>

          <div className="action-box">
            {edit ? (
              <button className="btn save-btn" onClick={handleSave}>💾 Save</button>
            ) : (
              <button className="btn edit-btn" onClick={handleEdit}>✏️ Edit</button>
            )}
          </div>
        </div>

        <div className="profile-card password-section">
          <h4>🔐 Change Password</h4>
          <input
            type="password"
            placeholder="Old Password"
            value={passwords.oldPassword}
            onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
          />
          <input
            type="password"
            placeholder="New Password"
            value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
          />
          <button className="btn change-btn" onClick={handlePasswordChange}>
            Change Password
          </button>
        </div>
      </div>

      {msg && <div className="msg-box fade-in">{msg}</div>}
    </div>
  );
}

export default StudentProfile;
