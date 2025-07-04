const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
<<<<<<< HEAD
const sendOTP = require("../utils/sendEmail");

=======
const Log = require("../models/Log"); // ✅ Add Log model
>>>>>>> fbd6d69c8e25ddd0059941aef24936dec5f7e1fa
const router = express.Router();

// 🔹 Send OTP
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = Date.now() + 10 * 60 * 1000; // valid for 10 min

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email });
    }

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    await sendOTP(email, otp);

    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    await user.save();

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
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

    const hashed = await bcrypt.hash(password, 10);
    user.name = name;
    user.password = hashed;
    user.role = role;
    await user.save();

    res.status(200).json({ message: "Registration complete. You can now login." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 Traditional Register (optional: keep or disable)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Optionally: check if verified
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role, isVerified: true });
    await user.save();

<<<<<<< HEAD
    res.status(201).json({ message: "User registered directly (without OTP flow)" });
=======
    // ✅ Log registration
    await Log.create({
      action: `Registered as ${role}`,
      user: email,
      role: role,
      ip: req.ip,
      timestamp: new Date(),
    });

    res.status(201).json({ message: "User registered" });
>>>>>>> fbd6d69c8e25ddd0059941aef24936dec5f7e1fa
  } catch (err) {
    res.status(500).json({ message: err.message });
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

<<<<<<< HEAD
    // ✅ You can restrict unverified users here (optional)
    // if (!user.isVerified) return res.status(403).json({ message: "Please verify your email first" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
=======
    // JWT Token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // ✅ Log successful login
    await Log.create({
      action: `Logged in`,
      user: user.email,
      role: user.role,
      ip: req.ip,
      timestamp: new Date(),
    });
>>>>>>> fbd6d69c8e25ddd0059941aef24936dec5f7e1fa

    res.status(200).json({
      message: "Login successful",
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
