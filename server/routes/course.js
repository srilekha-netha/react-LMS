const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Course = require('../models/Course');
const User = require('../models/User');

const router = express.Router();

// Ensure upload directories exist
['uploads', 'uploads/thumbnails', 'uploads/chapter_files', 'uploads/others'].forEach(folder => {
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
});

// Configure Multer storage
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
const upload = multer({ storage });

// TEST Route
router.get('/test', (req, res) => {
  res.send('Course route is working!');
});

// Create Course
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
      teacher,
      thumbnail,
      published: true,
    });
    await newCourse.save();
    res.status(201).json({ message: 'Course created!', course: newCourse });
  } catch (err) {
    res.status(500).json({ message: 'Error creating course', error: err.message });
  }
});

// Get all courses by teacher
router.get('/teacher/:teacherId', async (req, res) => {
  try {
    const courses = await Course.find({ teacher: req.params.teacherId });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Error getting courses', error: err.message });
  }
});

// Add Chapter
router.post('/:id/add-chapter', upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, content, quiz } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const videoUrl = req.files['video'] ? '/uploads/chapter_files/' + req.files['video'][0].filename : '';
    const pdfUrl = req.files['pdf'] ? '/uploads/chapter_files/' + req.files['pdf'][0].filename : '';
    let quizArr = quiz ? JSON.parse(quiz) : [];

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

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all courses without filtering by published
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    const result = await Promise.all(
      courses.map(async (course) => {
        let teacherName = "Unknown";
        try {
          const teacher = await User.findById(course.teacher).select("name");
          if (teacher) teacherName = teacher.name;
        } catch (err) {
          console.warn(`⚠️ Could not fetch teacher for course ${course._id}:`, err.message);
        }

        return {
          id: course._id,
          title: course.title,
          description: course.description || "No description",
          price: Number(course.price),
          difficulty: course.difficulty,
          thumbnail: course.thumbnail,
          teacher: course.teacher,
          teacherName: teacherName,
          published: course.published
        };
      })
    );

    return res.status(200).json(result);

  } catch (err) {
    console.error("🔥 Error in /:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// Update Course
router.put('/:id', upload.single('thumbnail'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.thumbnail = req.file.filename;
    if (typeof updateData.published !== "undefined") {
      updateData.published = updateData.published === 'true' || updateData.published === true;
    }
    delete updateData.chapters;
    delete updateData.teacher;

    const updated = await Course.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: 'Course not found' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating course', error: err.message });
  }
});

// Submit Quiz
router.post('/:id/submit-quiz/:chapterIdx', async (req, res) => {
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
    const passed = percent >= 70;
    res.json({ score, percent, passed, total: quiz.length });
  } catch (err) {
    res.status(500).json({ message: "Error submitting quiz", error: err.message });
  }
});

// Delete Course
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting course", error: err.message });
  }
});

module.exports = router;
