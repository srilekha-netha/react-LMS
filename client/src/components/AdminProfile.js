import React, { useState, useEffect } from "react";
import { Form, Button, Card, Container, Alert } from "react-bootstrap";
import axios from "axios";

function AdminProfile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });
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

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      // ✅ Update name/email/role
      await axios.put(`http://localhost:5000/api/users/${admin._id}`, {
        name: profile.name,
        email: profile.email,
        role: profile.role,
      });

      // ✅ Optional: Change password
      if (profile.password.trim()) {
        await axios.post(`http://localhost:5000/api/users/${admin._id}/change-password`, {
          oldPassword: "admin", // replace with real auth logic
          newPassword: profile.password,
        });
      }

      setMessage("Profile updated successfully");
    } catch (err) {
      setError("❌ Update failed. Please try again.");
    }
  };

  return (
    <Container className="my-4">
      <Card>
        <Card.Header as="h5">👤 Admin Profile</Card.Header>
        <Card.Body>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Password (optional)</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={profile.password}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={profile.role}
                onChange={handleChange}
              >
                <option value="admin">Admin</option>
                <option value="sub-admin">Sub-Admin</option>
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit">
              Update Profile
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AdminProfile;
