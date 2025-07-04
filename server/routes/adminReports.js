// server/routes/adminReports.js
const express    = require("express");
const router     = express.Router();
const User       = require("../models/User");
const Enrollment = require("../models/Enrollment");
const Course     = require("../models/Course");

// 1) Active Learners since an optional date
// GET /api/admin/reports/active-learners?since=2025-06-01
router.get("/active-learners", async (req, res) => {
  try {
    const since = req.query.since ? new Date(req.query.since) : new Date(0);
    const count = await User.countDocuments({ lastLogin: { $gte: since } });
    res.json({ count });
  } catch (err) {
    console.error("❌ active-learners error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 2) Course Engagement: total chapter-unlocks per course
// GET /api/admin/reports/engagement
router.get("/engagement", async (_req, res) => {
  try {
    const data = await Enrollment.aggregate([
      { $group: { _id: "$course", totalUnlocks: { $sum: "$chaptersUnlocked" } } },
      { $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "course"
        }
      },
      { $unwind: "$course" },
      { $project: { courseTitle: "$course.title", totalUnlocks: 1 } }
    ]);
    res.json(data);
  } catch (err) {
    console.error("❌ engagement error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 3) Completion Rates per course
// GET /api/admin/reports/completion-rates
router.get("/completion-rates", async (_req, res) => {
  try {
    const courses = await Course.find().select("_id title");
    const rates = await Promise.all(courses.map(async c => {
      const total = await Enrollment.countDocuments({ course: c._id });
      const done  = await Enrollment.countDocuments({ course: c._id, completed: true });
      return {
        courseId: c._id,
        title: c.title,
        rate: total ? Math.round((done/total)*100) : 0
      };
    }));
    res.json(rates);
  } catch (err) {
    console.error("❌ completion-rates error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
