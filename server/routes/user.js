const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Log = require("../models/Log"); // ✅ import log model
const router = express.Router();

// ✅ Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// ✅ Get user profile
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  res.json(user);
});

// ✅ Update profile
router.put("/:id", async (req, res) => {
  const update = { ...req.body };
  delete update.password;

  const user = await User.findByIdAndUpdate(req.params.id, update, { new: true });

  // ✅ Log profile update
  await Log.create({
    action: "Updated profile",
    user: user.email,
    role: user.role,
    ip: req.ip,
    timestamp: new Date()
  });

  res.json(user);
});

// ✅ Change password
router.post("/:id/change-password", async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.params.id);

  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match) return res.status(400).json({ message: "Old password incorrect" });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  // ✅ Log password change
  await Log.create({
    action: "Changed password",
    user: user.email,
    role: user.role,
    ip: req.ip,
    timestamp: new Date()
  });

  res.json({ message: "Password changed" });
});

module.exports = router;
