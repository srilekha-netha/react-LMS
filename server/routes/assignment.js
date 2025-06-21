const express = require("express");
const multer = require("multer");
const Assignment = require("../models/Assignment");
const path = require("path");
const fs = require("fs");
const router = express.Router();

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
const upload = multer({ storage: storage });

// Student: Submit assignment
router.post("/submit", upload.single("file"), async (req, res) => {
  try {
    const { student, course, chapter } = req.body;
    const fileUrl = req.file ? `/uploads/assignments/${req.file.filename}` : "";
    let assignment = await Assignment.findOne({ student, course, chapter });
    if (assignment) {
      assignment.fileUrl = fileUrl;
      assignment.status = "Submitted";
      await assignment.save();
    } else {
      assignment = new Assignment({ student, course, chapter, fileUrl, status: "Submitted" });
      await assignment.save();
    }
    res.json({ message: "Assignment submitted!", assignment });
  } catch (err) {
    res.status(500).json({ message: "Submission failed", error: err.message });
  }
});

// Student: List assignments for user
router.get("/byUser/:userId", async (req, res) => {
  const assignments = await Assignment.find({ student: req.params.userId }).populate("course");
  res.json(assignments);
});

// Teacher/Student: View assignment status by course+chapter+student
router.get("/status/:courseId/:chapter/:userId", async (req, res) => {
  const { courseId, chapter, userId } = req.params;
  const a = await Assignment.findOne({ student: userId, course: courseId, chapter });
  res.json(a || {});
});

module.exports = router;
