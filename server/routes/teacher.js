// server/routes/teacher.js
const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const User = require("../models/User");

router.get("/earnings/by-student/:teacherId", async (req, res) => {
  try {
    const teacherId = req.params.teacherId;

    // Get all courses by this teacher
    const courses = await Course.find({ teacher: teacherId });
    const courseIds = courses.map((c) => c._id);

    // Get all enrollments for these courses
    const enrollments = await Enrollment.find({ course: { $in: courseIds } })
      .populate("student")
      .populate("course");

    // Get all payments for these courses
    const payments = await Payment.find({ course: { $in: courseIds } });

    // Create map to check paid students by course
    const paidMap = new Map();
    payments.forEach((p) => {
      paidMap.set(`${p.student}_${p.course}`, p); // key format: studentId_courseId
    });

    const earningsByStudent = {};

    enrollments.forEach((e) => {
      const studentName = e.student?.name || "Unknown";
      const courseTitle = e.course?.title || "Unknown";
      const key = `${e.student._id}_${e.course._id}`;

      if (!earningsByStudent[studentName]) {
        earningsByStudent[studentName] = {
          student: studentName,
          totalPaid: 0,
          courses: [],
        };
      }

      const paid = paidMap.get(key);
      earningsByStudent[studentName].courses.push({
        title: courseTitle,
        amount: paid?.amount || 0,
        date: paid?.date || null,
        status: paid ? "Paid" : "Unpaid",
      });

      if (paid) {
        earningsByStudent[studentName].totalPaid += paid.amount;
      }
    });

    res.json(Object.values(earningsByStudent));
  } catch (err) {
    console.error("❌ Earnings by student error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
