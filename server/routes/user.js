const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Log = require("../models/Log");
const router = express.Router();

// ✅ Central log helper
const logAction = async (action, user, role, ip) => {
  try {
    if (!action || !user) return;
    const result = await Log.create({
      action,
      user,
      role,
      ip: ip || "unknown",
      timestamp: new Date(),
    });
    console.log("✅ Log:", result._id, action);
  } catch (err) {
    console.error("❌ Log error:", err.message);
  }
};

// ✅ Get all users (excluding passwords)
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// ✅ Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("❌ Error fetching user:", err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

// ✅ Update user profile
router.put("/:id", async (req, res) => {
  try {
    const update = { ...req.body };
    delete update.password;

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true });

    if (!user) return res.status(404).json({ message: "User not found" });

    await logAction(
      `Updated profile (${Object.keys(update).join(", ")})`,
      user.email,
      user.role,
      req.ip
    );

    res.json(user);
  } catch (err) {
    console.error("❌ Error updating profile:", err);
    res.status(500).json({ message: "Failed to update user" });
  }
});

// ✅ Change password
router.post("/:id/change-password", async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return res.status(400).json({ message: "Old password incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    await logAction("Changed password", user.email, user.role, req.ip);

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("❌ Password change error:", err);
    res.status(500).json({ message: "Failed to change password" });
  }
});

module.exports = router;
