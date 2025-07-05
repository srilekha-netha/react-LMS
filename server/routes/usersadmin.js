const express = require("express");
const User = require("../models/User");
const Log = require("../models/Log");

const router = express.Router();

// ✅ Centralized log action helper
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
    console.log("✅ Admin Log:", result._id, action);
  } catch (err) {
    console.error("❌ Failed to log action:", err.message);
  }
};

// ⚠️ Replace this with `req.user.email` and `req.user.role` when auth is enabled
const ADMIN_EMAIL = "admin@yourdomain.com";
const ADMIN_ROLE = "admin";

// 1️⃣ Get all users (students and teachers)
router.get("/", async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ["student", "teacher"] } }).select("-password");

    await logAction("Viewed all students and teachers", ADMIN_EMAIL, ADMIN_ROLE, req.ip);

    res.json(users);
  } catch (err) {
    console.error("⛔ GET /admin/users error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 2️⃣ Update user role
router.put("/:userId/role", async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.userId, { role }, { new: true });

    if (!user) return res.status(404).json({ message: "User not found" });

    await logAction(`Updated role to ${role} for ${user.email}`, ADMIN_EMAIL, ADMIN_ROLE, req.ip);

    res.json({ message: "Role updated", user });
  } catch (err) {
    console.error("⛔ PUT /admin/users/:userId/role error:", err);
    res.status(500).json({ message: "Error updating role" });
  }
});

// 3️⃣ Block or unblock a user
router.put("/:userId/block", async (req, res) => {
  try {
    const { blocked } = req.body;
    const user = await User.findByIdAndUpdate(req.params.userId, { blocked }, { new: true });

    if (!user) return res.status(404).json({ message: "User not found" });

    const action = `${blocked ? "Blocked" : "Unblocked"} user ${user.email}`;
    await logAction(action, ADMIN_EMAIL, ADMIN_ROLE, req.ip);

    res.json({ message: "Block status updated", user });
  } catch (err) {
    console.error("⛔ PUT /admin/users/:userId/block error:", err);
    res.status(500).json({ message: "Error updating block status" });
  }
});

// 4️⃣ Delete a user
router.delete("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    await User.findByIdAndDelete(user._id);

    await logAction(`Deleted user ${user.email}`, ADMIN_EMAIL, ADMIN_ROLE, req.ip);

    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("⛔ DELETE /admin/users/:userId error:", err);
    res.status(500).json({ message: "Error deleting user" });
  }
});

module.exports = router;
