import React, { useState, useEffect } from "react";

function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    expertise: "",
    password: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (user && user.name && user.email) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        expertise: user.expertise || "",
        password: "",
      });
    }
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    // Optional: Save to API or localStorage (demo purpose)
    alert("Profile updated successfully!");
  };

  return (
    <div className="container-fluid">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: "600px" }}>
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">
            <i className="bi bi-person-circle me-2"></i>My Profile
          </h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleUpdate}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-control"
                value={profile.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                value={profile.email}
                onChange={handleChange}
                required
                readOnly // Disable email change if you want
              />
            </div>

            <div className="mb-3">
              <label htmlFor="bio" className="form-label">Bio</label>
              <textarea
                id="bio"
                name="bio"
                className="form-control"
                rows="3"
                value={profile.bio}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="expertise" className="form-label">Expertise</label>
              <input
                id="expertise"
                name="expertise"
                type="text"
                className="form-control"
                value={profile.expertise}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Change Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-control"
                value={profile.password}
                onChange={handleChange}
              />
            </div>

            <div className="text-end">
              <button type="submit" className="btn btn-success">
                <i className="bi bi-save me-1"></i> Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
