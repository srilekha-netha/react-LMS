import React, { useState, useEffect } from "react";
import { Form, Button, Card, Container, Alert } from "react-bootstrap";
import axios from "axios";

function AdminProfile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "admin",
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const admin = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (admin?._id) {
      axios
        .get(`http://localhost:5000/api/users/${admin._id}`)
        .then((res) => setProfile((prev) => ({ ...prev, ...res.data })))
        .catch(() => setError("Failed to load profile"));
    }
  }, [admin?._id]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await axios.put(`http://localhost:5000/api/users/${admin._id}`, {
        name: profile.name,
        email: profile.email,
        role: profile.role,
      });
      setMessage("Profile updated successfully");
    } catch (err) {
      setError("❌ Update failed. Please try again.");
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
      await axios.post(`http://localhost:5000/api/users/${admin._id}/change-password`, {
        oldPassword: currentPassword,
        newPassword,
      });

      setMessage("🔐 Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError("❌ Failed to change password. Please try again.");
    }
  };

  return (
    <Container className="my-4">
      <Card>
        <Card.Header as="h5">👤 Admin Profile</Card.Header>
        <Card.Body>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleUpdateProfile}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={profile.role}
                onChange={handleProfileChange}
              >
                <option value="admin">Admin</option>
                <option value="sub-admin">Sub-Admin</option>
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit">
              Update Profile
            </Button>
          </Form>

          <hr />

          <h6 className="mt-4">🔑 Change Password</h6>
          <Form onSubmit={handlePasswordChange}>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="warning" type="submit">
              Change Password
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AdminProfile;
