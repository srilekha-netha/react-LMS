const express = require('express');
const multer = require('multer');
const Course = require('../models/Course');
const router = express.Router();
const path = require("path");
const fs = require('fs');

// Make sure folders exist
['uploads', 'uploads/thumbnails', 'uploads/chapter_files', 'uploads/others'].forEach(folder => {
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
});

// Multer storage setup for files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "thumbnail") {
      cb(null, 'uploads/thumbnails/');
    } else if (file.fieldname === "video" || file.fieldname === "pdf") {
      cb(null, 'uploads/chapter_files/');
    } else {
      cb(null, 'uploads/others/');
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// ---------- TEST Route ----------
router.get('/test', (req, res) => {
  res.send('Course route is working!');
});

// ---------- CREATE Course ----------
router.post('/create', upload.single('thumbnail'), async (req, res) => {
  try {
    const { title, description, category, difficulty, price, teacher } = req.body;
    const thumbnail = req.file ? req.file.filename : '';
    const newCourse = new Course({
      title,
      description,
      category,
      difficulty,
      price,
      teacher, // MongoDB ObjectId string (must exist)
      thumbnail,
    });
    await newCourse.save();
    res.status(201).json({ message: 'Course created!', course: newCourse });
  } catch (err) {
    res.status(500).json({ message: 'Error creating course', error: err.message });
  }
});

// ---------- Get all courses by teacher ----------
router.get('/teacher/:teacherId', async (req, res) => {
  try {
    const courses = await Course.find({ teacher: req.params.teacherId });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Error getting courses', error: err.message });
  }
});

// ---------- Add Chapter (video/pdf/quiz) ----------
router.post('/:id/add-chapter', upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, content, quiz } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // File URLs
    const videoUrl = req.files['video'] ? '/uploads/chapter_files/' + req.files['video'][0].filename : '';
    const pdfUrl = req.files['pdf'] ? '/uploads/chapter_files/' + req.files['pdf'][0].filename : '';
    let quizArr = [];
    if (quiz) quizArr = JSON.parse(quiz);

    course.chapters.push({
      title,
      videoUrl,
      pdfUrl,
      content,
      quiz: quizArr,
      locked: true
    });
    await course.save();

    res.status(201).json({ message: "Chapter added", chapters: course.chapters });
  } catch (err) {
    res.status(500).json({ message: "Error adding chapter", error: err.message });
  }
});

// ---------- Get course by ID ----------
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!id || id === "undefined") {
    return res.status(400).json({ message: "Course ID is required" });
  }
  try {
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ---------- Get all published courses (Explore) ----------
router.get('/published', async (req, res) => {
  try {
    const courses = await Course.find({ published: true });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ---------- Update course (PUT) ----------
router.put('/:id', upload.single('thumbnail'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.thumbnail = req.file.filename;
    // Always ensure published is boolean
    if (typeof updateData.published !== "undefined")
      updateData.published = updateData.published === 'true' || updateData.published === true;
    // Prevent updating critical fields directly
    delete updateData.chapters;
    delete updateData.teacher;

    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Course not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating course', error: err.message });
  }
});

// ---------- Submit Quiz Answers ----------
router.post("/:id/submit-quiz/:chapterIdx", async (req, res) => {
  try {
    const { userId, answers } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const chapterIdx = parseInt(req.params.chapterIdx, 10);
    const quiz = course.chapters[chapterIdx]?.quiz || [];
    let score = 0;
    quiz.forEach((q, idx) => {
      if (answers[idx] && answers[idx].toLowerCase() === q.answer.toLowerCase()) score++;
    });
    const percent = quiz.length > 0 ? Math.round((score / quiz.length) * 100) : 0;
    let passed = percent >= 70;
    res.json({ score, percent, passed, total: quiz.length });
  } catch (err) {
    res.status(500).json({ message: "Error submitting quiz", error: err.message });
  }
});

module.exports = router;
