const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Assignment = require("../models/Assignment");
const Course = require("../models/Course");
const User = require("../models/User");
const Notification = require("../models/Notification");

const router = express.Router();

// ✅ Storage config for PDF-only
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/assignments";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  }
});

// ✅ Submit assignment and notify teacher
router.post("/submit", upload.single("file"), async (req, res) => {
  try {
    const { student, course, chapter } = req.body;
    const fileUrl = `/uploads/assignments/${req.file.filename}`;

    const courseDoc = await Course.findById(course);
    if (!courseDoc) return res.status(404).json({ message: "Course not found" });

    const teacher = courseDoc.teacher;
    let assignment = await Assignment.findOne({ student, course, chapter });

    if (assignment) {
      assignment.fileUrl = fileUrl;
      assignment.status = "Submitted";
      assignment.teacher = teacher;
      await assignment.save();
    } else {
      assignment = new Assignment({
        student,
        teacher,
        course,
        chapter,
        fileUrl,
        status: "Submitted"
      });
      await assignment.save();
    }

    // 🔔 Notify the teacher
    const studentUser = await User.findById(student);
    await Notification.create({
      user: teacher,
      text: `📄 ${studentUser?.name || "Student"} submitted assignment for "${courseDoc.title}"`,
      icon: "bi bi-file-earmark-arrow-up",
      read: false
    });

    res.json({ message: "Assignment submitted!", assignment });
  } catch (err) {
    console.error("❌ Submit Error:", err);
    res.status(500).json({ message: "Submission failed", error: err.message });
  }
});

// ✅ Get assignments by student
router.get("/byUser/:userId", async (req, res) => {
  try {
    const assignments = await Assignment.find({ student: req.params.userId }).populate("course");
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch student assignments" });
  }
});

// ✅ Get assignments by teacher
router.get("/byTeacher/:teacherId", async (req, res) => {
  try {
    const assignments = await Assignment.find({ teacher: req.params.teacherId })
      .populate("student")
      .populate("course");
    res.json(assignments);
  } catch (err) {
    console.error("❌ Teacher Fetch Error:", err);
    res.status(500).json({ message: "Failed to fetch assignments", error: err.message });
  }
});

// ✅ Grade assignment and notify student
router.post("/grade/:assignmentId", async (req, res) => {
  try {
    const { grade } = req.body;

    const assignment = await Assignment.findByIdAndUpdate(
      req.params.assignmentId,
      { status: "Graded", grade },
      { new: true }
    ).populate("student").populate("course");

    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    // 🔔 Notify the student
    await Notification.create({
      user: assignment.student._id,
      text: `✅ Your assignment for "${assignment.course.title}" has been graded: ${grade}`,
      icon: "bi bi-patch-check-fill",
      read: false
    });

    res.json({ message: "Assignment graded", assignment });
  } catch (err) {
    console.error("❌ Grade Error:", err);
    res.status(500).json({ message: "Failed to grade assignment", error: err.message });
  }
});

module.exports = router;
