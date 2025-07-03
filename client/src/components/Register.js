import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);
      setMessage(res.data.message);
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={{ height: "100vh", backgroundColor: "#f8f9fa" }}>
      <Container fluid className="d-flex align-items-center justify-content-center h-100">
        <Card className="shadow-lg p-5" style={{ width: "600px", maxWidth: "90%" }}>
          <Card.Body>
            <Card.Title className="text-center mb-4 fs-3">Register</Card.Title>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="role">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
               
                </Form.Select>
              </Form.Group>

              {message && (
                <Alert variant={message.includes("failed") ? "danger" : "success"}>
                  {message}
                </Alert>
              )}

              <div className="d-grid mb-3">
                <Button variant="success" type="submit">
                  Register
                </Button>
              </div>

              <p className="text-center mb-0">
                Already have an account?{" "}
                <Link to="/" className="link-primary">
                  Login
                </Link>
              </p>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default Register;
