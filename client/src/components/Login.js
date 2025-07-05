import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import loginimage from "../img/loginimage.jpg"; // 📁 Make sure this path is correct

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      const role = res.data.user.role;

      setMessage("Login successful!");

      // ✅ Save full user and name separately
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("studentName", res.data.user.name); // 👈 Add this line

      // ✅ Navigate based on role
      if (role === "student") navigate("/student");
      else if (role === "teacher") navigate("/teacher");
      else if (role === "admin") navigate("/admin");
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={styles.wrapper}>
      <img src={loginimage} alt="Background" style={styles.backgroundImage} />

      <div style={styles.formContainer}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.heading}>Login</h2>

          <label style={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <label style={styles.label}>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            style={styles.input}
          />

          {message && (
            <div
              style={{
                ...styles.message,
                color: message.includes("failed") ? "#ff4d4d" : "#00ff90",
              }}
            >
              {message}
            </div>
          )}

          <button type="submit" style={styles.button}>
            Login
          </button>

          <p style={styles.footerText}>
            Don’t have an account?{" "}
            <a href="/register" style={styles.link}>
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    position: "relative",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 1,
    filter: "brightness(0.5)",
  },
  formContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    borderRadius: "16px",
    padding: "40px",
    width: "90%",
    maxWidth: "400px",
    zIndex: 2,
    boxShadow: "0 0 20px rgba(0,0,0,0.4)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  heading: {
    textAlign: "center",
    marginBottom: "1.5rem",
    color: "#fff",
    fontSize: "28px",
    fontWeight: "bold",
  },
  label: {
    color: "#fff",
    marginBottom: "5px",
    fontWeight: "500",
  },
  input: {
    padding: "10px 14px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "none",
    fontSize: "16px",
  },
  button: {
    backgroundColor: "#4f46e5",
    color: "#fff",
    padding: "12px",
    fontWeight: "bold",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "10px",
  },
  message: {
    textAlign: "center",
    marginBottom: "10px",
    fontWeight: "bold",
  },
  footerText: {
    marginTop: "1rem",
    textAlign: "center",
    color: "#f1f1f1",
  },
  link: {
    color: "#90cdf4",
    textDecoration: "none",
    fontWeight: "500",
  },
};

export default Login;
