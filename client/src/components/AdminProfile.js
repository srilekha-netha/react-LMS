import React, { useState } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";

function AdminProfile() {
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@example.com",
    password: "",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile updated successfully!");
    // TODO: Send updated profile to backend API
  };

  return (
    <Container className="my-4">
      <Card>
        <Card.Header as="h5">Admin Profile</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="adminName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="adminEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="adminPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={profile.password}
                onChange={handleChange}
              />
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
