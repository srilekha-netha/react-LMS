import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import loginimage from "../img/loginimage.jpg";

function Register() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    otp: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/send-otp", {
        email: form.email,
      });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email: form.email,
        otp: form.otp,
      });
      setMessage(res.data.message);
      setStep(3);
    } catch (err) {
      setMessage(err.response?.data?.message || "OTP verification failed");
    }
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/set-password", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      setMessage(res.data.message);
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  const renderStepForm = () => {
    switch (step) {
      case 1:
        return (
          <>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <button onClick={handleSendOtp} style={styles.button}>
              Send OTP
            </button>
          </>
        );
      case 2:
        return (
          <>
            <label style={styles.label}>Enter OTP</label>
            <input
              type="text"
              name="otp"
              value={form.otp}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <button onClick={handleVerifyOtp} style={styles.button}>
              Verify OTP
            </button>
          </>
        );
      case 3:
        return (
          <>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
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

            <label style={styles.label}>Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              style={{ ...styles.input, cursor: "pointer" }}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>

            <button onClick={handleSetPassword} style={styles.button}>
              Complete Registration
            </button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.wrapper}>
      <img src={loginimage} alt="Background" style={styles.backgroundImage} />
      <div style={styles.formContainer}>
        <form onSubmit={(e) => e.preventDefault()} style={styles.form}>
          <h2 style={styles.heading}>Register</h2>
          {renderStepForm()}

          {message && (
            <div
              style={{
                ...styles.message,
                color: message.toLowerCase().includes("fail") ? "#ff4d4d" : "#00ff90",
              }}
            >
              {message}
            </div>
          )}

          <p style={styles.footerText}>
            Already have an account?{' '}
            <a href="/" style={styles.link}>
              Login
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
  form: { display: "flex", flexDirection: "column" },
  heading: { textAlign: "center", marginBottom: "1.5rem", color: "#fff", fontSize: "28px", fontWeight: "bold" },
  label: { color: "#fff", marginBottom: "5px", fontWeight: "500" },
  input: { padding: "10px 14px", marginBottom: "15px", borderRadius: "6px", border: "none", fontSize: "16px" },
  button: { backgroundColor: "#4f46e5", color: "#fff", padding: "12px", fontWeight: "bold", fontSize: "16px", border: "none", borderRadius: "8px", cursor: "pointer", marginBottom: "10px" },
  message: { textAlign: "center", marginBottom: "10px", fontWeight: "bold" },
  footerText: { marginTop: "1rem", textAlign: "center", color: "#f1f1f1" },
  link: { color: "#90cdf4", textDecoration: "none", fontWeight: "500" },
};

export default Register;
