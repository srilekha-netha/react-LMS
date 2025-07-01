const express = require("express");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const router = express.Router();

// ✅ Enroll in a course (called after payment success)
router.post("/enroll", async (req, res) => {
  const { userId, courseId, amountPaid } = req.body;

  try {
    const exists = await Enrollment.findOne({ student: userId, course: courseId });
    if (exists) return res.status(400).json({ message: "Already enrolled" });

    const enrollment = new Enrollment({
      student: userId,
      course: courseId,
      chaptersUnlocked: 1,
      progress: 0,
      completed: false,
    });

    await enrollment.save();
    res.json({ message: "Enrolled successfully", enrollment });
  } catch (err) {
    console.error("❌ Enroll error:", err.message);
    res.status(500).json({ message: "Enrollment failed" });
  }
});

// ✅ Get all enrollments for a student
router.get("/byUser/:userId", async (req, res) => {
  try {
    const data = await Enrollment.find({ student: req.params.userId }).populate("course");
    res.json(data);
  } catch (err) {
    console.error("❌ Failed to fetch user enrollments:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get specific enrollment
router.get("/byUserAndCourse/:userId/:courseId", async (req, res) => {
  try {
    const data = await Enrollment.findOne({
      student: req.params.userId,
      course: req.params.courseId,
    });
    res.json(data);
  } catch (err) {
    console.error("❌ Error fetching enrollment:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Unlock next chapter if eligible
router.post("/unlockChapter", async (req, res) => {
  const { userId, courseId, chapterIndex } = req.body;

  try {
    const enrollment = await Enrollment.findOne({ student: userId, course: courseId });
    if (!enrollment) return res.status(404).json({ message: "Not enrolled" });

    const course = await Course.findById(courseId);
    const totalChapters = course.chapters.length;

    if (enrollment.chaptersUnlocked === chapterIndex + 1) {
      enrollment.chaptersUnlocked += 1;
      enrollment.progress = Math.round((enrollment.chaptersUnlocked / totalChapters) * 100);
      await enrollment.save();

      res.json({ message: "Chapter unlocked", chaptersUnlocked: enrollment.chaptersUnlocked });
    } else {
      res.status(400).json({ message: "Complete previous chapters first" });
    }
  } catch (err) {
    console.error("❌ Chapter unlock error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get published courses user is NOT enrolled in
router.get("/notEnrolled/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const allCourses = await Course.find({ published: true });
    const enrollments = await Enrollment.find({ student: userId }).select("course");

    const enrolledCourseIds = enrollments.map(e => e.course.toString());
    const notEnrolledCourses = allCourses.filter(
      course => !enrolledCourseIds.includes(course._id.toString())
    );

    res.json(notEnrolledCourses);
  } catch (err) {
    console.error("❌ Error fetching non-enrolled courses:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get enrollments for courses by teacher
router.get("/byTeacher/:teacherId", async (req, res) => {
  try {
    const teacherId = req.params.teacherId;
    const courses = await Course.find({ teacher: teacherId }).select("_id");
    const courseIds = courses.map(c => c._id);

    const enrollments = await Enrollment.find({ course: { $in: courseIds } })
      .populate("student")
      .populate("course");

    res.json(enrollments);
  } catch (err) {
    console.error("❌ Failed to get enrollments by teacher:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update quiz/chapter progress (used by ProgressTracker)
router.post("/progress/update", async (req, res) => {
  const { studentId, courseId, chapterId } = req.body;

  try {
    const enrollment = await Enrollment.findOne({ student: studentId, course: courseId });
    if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });

    if (!enrollment.completedQuizzes.includes(chapterId)) {
      enrollment.completedQuizzes.push(chapterId);

      const course = await Course.findById(courseId);
      const totalChapters = course.chapters.length;

      const nextChapter = chapterId + 1;
      if (enrollment.chaptersUnlocked < nextChapter) {
        enrollment.chaptersUnlocked = nextChapter;
      }

      enrollment.progress = Math.floor((enrollment.completedQuizzes.length / totalChapters) * 100);
      enrollment.completed = enrollment.progress === 100;

      await enrollment.save();
    }

    res.json({ message: "Progress updated", enrollment });
  } catch (err) {
    console.error("❌ Progress update error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
