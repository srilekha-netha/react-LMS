const express = require("express");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const router = express.Router();

// ✅ Enroll in a course
router.post("/enroll", async (req, res) => {
  const { userId, courseId, amountPaid } = req.body;
  const exists = await Enrollment.findOne({ student: userId, course: courseId });
  if (exists) return res.status(400).json({ message: "Already enrolled" });

  const enrollment = new Enrollment({ student: userId, course: courseId });
  await enrollment.save();

  res.json({ message: "Enrolled", enrollment });
});

// ✅ Get all enrollments for a user
router.get("/byUser/:userId", async (req, res) => {
  const data = await Enrollment.find({ student: req.params.userId }).populate("course");
  res.json(data);
});

// ✅ Get enrollment by user & course
router.get("/byUserAndCourse/:userId/:courseId", async (req, res) => {
  const data = await Enrollment.findOne({
    student: req.params.userId,
    course: req.params.courseId,
  });
  res.json(data);
});

// ✅ Unlock next chapter
router.post("/unlockChapter", async (req, res) => {
  const { userId, courseId, chapterIndex } = req.body;
  const enroll = await Enrollment.findOne({ student: userId, course: courseId });

  if (!enroll) return res.status(400).json({ message: "Not enrolled" });

  const course = await Course.findById(courseId);
  const totalChapters = course.chapters.length;

  // Only unlock if next chapter
  if (enroll.chaptersUnlocked === chapterIndex + 1) {
    enroll.chaptersUnlocked += 1;
    enroll.progress = Math.round((enroll.chaptersUnlocked / totalChapters) * 100);

    await enroll.save();
    res.json({ message: "Chapter unlocked", chaptersUnlocked: enroll.chaptersUnlocked });
  } else {
    res.status(400).json({ message: "Complete previous chapters" });
  }
});

// ✅ NEW: Get courses user is NOT enrolled in
router.get("/notEnrolled/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const allCourses = await Course.find({ published: true });
    const enrollments = await Enrollment.find({ student: userId }).select("course");

    const enrolledCourseIds = enrollments
      .filter((e) => e.course && e.course.toString) // ⛑️ filter out null/undefined
      .map((e) => e.course.toString());

    const notEnrolledCourses = allCourses.filter(
      (course) => !enrolledCourseIds.includes(course._id.toString())
    );

    res.json(notEnrolledCourses);
  } catch (err) {
    console.error("❌ Error in /notEnrolled:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get students enrolled in courses taught by this teacher
router.get("/byTeacher/:teacherId", async (req, res) => {
  try {
    const teacherId = req.params.teacherId;

    const teacherCourses = await Course.find({ teacher: teacherId }).select("_id");
    const courseIds = teacherCourses.map(course => course._id);

    const enrollments = await Enrollment.find({ course: { $in: courseIds } })
      .populate("student")
      .populate("course");

    res.json(enrollments);
  } catch (err) {
    console.error("❌ Failed to get enrollments by teacher:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
