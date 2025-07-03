const express = require("express");
const User = require("../models/User");
const Log = require("../models/Log"); // ✅ Import Log model
const router = express.Router();

// 1️⃣ GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ["student", "teacher"] } }).select("-password");

    // ✅ Log admin viewing all users
    await Log.create({
      action: "Viewed all students and teachers",
      user: "admin@yourdomain.com", // Or get from req.user if using auth
      role: "admin",
      ip: req.ip,
      timestamp: new Date()
    });

    res.json(users);
  } catch (err) {
    console.error("⛔ admin/users GET error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 2️⃣ Update role
router.put("/:userId/role", async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.userId, { role });

    // ✅ Log role change
    await Log.create({
      action: `Updated role to ${role} for ${user.email}`,
      user: "admin@yourdomain.com",
      role: "admin",
      ip: req.ip,
      timestamp: new Date()
    });

    res.json({ message: "Role updated" });
  } catch (err) {
    res.status(500).json({ message: "Error updating role" });
  }
});

// 3️⃣ Toggle block
router.put("/:userId/block", async (req, res) => {
  try {
    const { blocked } = req.body;
    const user = await User.findByIdAndUpdate(req.params.userId, { blocked });

    await Log.create({
      action: `${blocked ? "Blocked" : "Unblocked"} user ${user.email}`,
      user: "admin@yourdomain.com",
      role: "admin",
      ip: req.ip,
      timestamp: new Date()
    });

    res.json({ message: "Block status updated" });
  } catch (err) {
    res.status(500).json({ message: "Error updating block status" });
  }
});

// 4️⃣ Delete user
router.delete("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    await User.findByIdAndDelete(req.params.userId);

    await Log.create({
      action: `Deleted user ${user.email}`,
      user: "admin@yourdomain.com",
      role: "admin",
      ip: req.ip,
      timestamp: new Date()
    });

    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

module.exports = router;
