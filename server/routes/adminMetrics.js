// routes/adminStats.js
const express = require("express");
const User = require("../models/User");
const Course = require("../models/Course");
const router = express.Router();

// GET /api/admin/stats
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: { $in: ["student", "teacher"] } });
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalTeachers = await User.countDocuments({ role: "teacher" });
    const pendingApprovals = await User.countDocuments({ role: "teacher", verified: false });
    const publishedCourses = await Course.countDocuments({ published: true });

    res.json({
      totalUsers,
      totalStudents,
      totalTeachers,
      pendingApprovals,
      publishedCourses,
    });
  } catch (err) {
    console.error("❌ Error in /api/admin/stats:", err);
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
});

module.exports = router;
