const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const Payment = require("../models/Payment"); // Optional, only if you're storing payments

// GET /api/admin/stats
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: { $in: ["student", "teacher"] } });
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalTeachers = await User.countDocuments({ role: "teacher" });
    const pendingApprovals = await User.countDocuments({ role: "teacher", verified: false });
    const publishedCourses = await Course.countDocuments({ published: true });

    const totalEnrollments = await Enrollment.countDocuments();
    const activeStudents = await Enrollment.distinct("student").then(ids => ids.length);
    const coursesAwaitingApproval = await Course.countDocuments({ published: false });

    let totalEarnings = 0;
    try {
      const payments = await Payment.find();
      totalEarnings = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    } catch (err) {
      console.warn("⚠️ Payment model not available or empty.");
    }

    res.json({
      totalUsers,
      totalStudents,
      totalTeachers,
      pendingApprovals,
      publishedCourses,
      totalEnrollments,
      activeStudents,
      coursesAwaitingApproval,
      totalEarnings,
    });
  } catch (err) {
    console.error("❌ Error in /api/admin/stats:", err);
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
});

module.exports = router;
