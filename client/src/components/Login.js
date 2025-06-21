import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";
import illustration from "../img/illustration.png";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      const role = res.data.user.role;
<<<<<<< HEAD
      setMessage("Login successful!");
      localStorage.setItem("user", JSON.stringify(res.data.user));

=======
      localStorage.setItem("user", JSON.stringify(res.data.user));
>>>>>>> origin/Spandana
      if (role === "student") navigate("/student");
      else if (role === "teacher") navigate("/teacher");
      else if (role === "admin") navigate("/admin");
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <img src={illustration} alt="Signup Illustration" />
      </div>
      <div className="login-right">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {message && (
            <div className={`message ${message.toLowerCase().includes("failed") ? "error" : "success"}`}>
              {message}
            </div>
          )}

          <button type="submit">Login</button>

          <p className="login-link">
            Don’t have an account? <a href="/register">Register</a>
          </p>
        </form>
      </div>
    </div>
  );
}
export default Login;
