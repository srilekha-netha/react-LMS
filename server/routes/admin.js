// routes/admin.js
const express = require("express");
const User = require("../models/User");
const Course = require("../models/Course");
const Payment = require("../models/Payment");
const router = express.Router();
const User = require("../models/User");

// GET all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// UPDATE role
router.put("/users/:id/role", async (req, res) => {
  const { role } = req.body;
  await User.findByIdAndUpdate(req.params.id, { role });
  res.json({ message: "Role updated" });
});

// TOGGLE block
router.put("/users/:id/block", async (req, res) => {
  const { blocked } = req.body;
  await User.findByIdAndUpdate(req.params.id, { blocked });
  res.json({ message: "Block status updated" });
});

// DELETE user
router.delete("/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});


router.get("/metrics", async (req, res) => {
  try {
    const users = await User.countDocuments();
    const teachers = await User.countDocuments({ role: "teacher" });
    const courses = await Course.countDocuments();
    const pendingCourses = await Course.countDocuments({ published: false });
    const earnings = await Payment.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);
    res.json({
      users,
      teachers,
      courses,
      pendingCourses,
      earnings: earnings[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch admin metrics" });
  }
});

module.exports = router;
