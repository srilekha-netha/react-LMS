const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Log = require("../models/Log");
const sendOTP = require("../utils/sendEmail");

const router = express.Router();

// ✅ Enhanced Logging Helper
const logAction = async (action, user, role, ip) => {
  try {
    if (!action || !user) {
      console.warn("⚠️ Missing action or user for logging");
      return;
    }

    console.log("📌 Logging Action =>", { action, user, role, ip });

    const result = await Log.create({
      action,
      user,
      role,
      ip: ip || "unknown",
      timestamp: new Date(),
    });

    console.log("✅ Log saved:", result._id);
  } catch (err) {
    console.error("❌ Failed to log action:", err.message);
  }
};

// 🔹 Send OTP
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = Date.now() + 10 * 60 * 1000;

    let user = await User.findOne({ email });

    if (!user) user = new User({ email });

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    user.isVerified = false;

    await user.save({ validateBeforeSave: false });

    await sendOTP(email, otp);
    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("❌ OTP Send Error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// 🔹 Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || Date.now() > user.otpExpiresAt) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save({ validateBeforeSave: false });

    await logAction("OTP verified", email, "pending", req.ip);

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("❌ OTP Verify Error:", err);
    res.status(500).json({ message: "OTP verification failed" });
  }
});

// 🔹 Set Password after OTP verification
router.post("/set-password", async (req, res) => {
  try {
    const { email, name, password, role } = req.body;
    if (!email || !name || !password || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ email });
    if (!user || !user.isVerified) {
      return res.status(400).json({ message: "Email not verified" });
    }

    user.name = name;
    user.role = role;
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    await logAction(`Registered as ${role}`, email, role, req.ip);

    res.status(200).json({ message: "Registration complete. You can now login." });
  } catch (err) {
    console.error("❌ Set Password Error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
});

// 🔹 Traditional Register (skip OTP)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      name,
      email,
      role,
      password: await bcrypt.hash(password, 10),
      isVerified: true,
    });

    await user.save();
    await logAction(`Registered as ${role}`, email, role, req.ip);

    res.status(201).json({ message: "User registered" });
  } catch (err) {
    console.error("❌ Register Error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
});

// 🔹 Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    await logAction("Logged in", email, user.role, req.ip);

    res.status(200).json({
      message: "Login successful",
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

// 🔹 Manual Log Test Route (optional)
router.get("/test-log", async (req, res) => {
  try {
    const result = await Log.create({
      action: "Manual Test",
      user: "admin@example.com",
      role: "admin",
      ip: req.ip,
      timestamp: new Date(),
    });
    res.send("✅ Log created: " + result._id);
  } catch (err) {
    res.status(500).send("❌ Log failed: " + err.message);
  }
});

module.exports = router;
