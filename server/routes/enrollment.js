const express = require("express");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const router = express.Router();

// Enroll in a course
router.post("/enroll", async (req, res) => {
  const { userId, courseId, amountPaid } = req.body;
  const exists = await Enrollment.findOne({ student: userId, course: courseId });
  if (exists) return res.status(400).json({ message: "Already enrolled" });
  const enrollment = new Enrollment({ student: userId, course: courseId });
  await enrollment.save();
  res.json({ message: "Enrolled", enrollment });
});

// Get all enrollments for a user
router.get("/byUser/:userId", async (req, res) => {
  const data = await Enrollment.find({ student: req.params.userId }).populate("course");
  res.json(data);
});

// Get enrollment by user & course
router.get("/byUserAndCourse/:userId/:courseId", async (req, res) => {
  const data = await Enrollment.findOne({ student: req.params.userId, course: req.params.courseId });
  res.json(data);
});

// Unlock next chapter
router.post("/unlockChapter", async (req, res) => {
  const { userId, courseId, chapterIndex } = req.body;
  const enroll = await Enrollment.findOne({ student: userId, course: courseId });
  if (!enroll) return res.status(400).json({ message: "Not enrolled" });
  // Only unlock if next
  if (enroll.chaptersUnlocked === chapterIndex + 1) {
    enroll.chaptersUnlocked += 1;
    enroll.progress = Math.round((enroll.chaptersUnlocked / (await Course.findById(courseId)).chapters.length) * 100);
    await enroll.save();
    res.json({ message: "Chapter unlocked", chaptersUnlocked: enroll.chaptersUnlocked });
  } else {
    res.status(400).json({ message: "Complete previous chapters" });
  }
});

module.exports = router;
