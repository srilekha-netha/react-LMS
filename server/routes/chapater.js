const express = require("express");
const multer = require("multer");
const path = require("path");
const Course = require("../models/Course");

const router = express.Router();

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/chapter_files/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// POST: Upload a chapter to a course
router.post("/upload/:courseId", upload.fields([{ name: "video" }, { name: "pdf" }]), async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const { title, content } = req.body;

    const chapter = {
      title,
      content,
      videoUrl: req.files?.video ? `/uploads/chapter_files/${req.files.video[0].filename}` : "",
      pdfUrl: req.files?.pdf ? `/uploads/chapter_files/${req.files.pdf[0].filename}` : "",
      quiz: [],
      locked: true,
    };

    course.chapters.push(chapter);
    await course.save();

    res.json({ message: "Chapter added successfully", course });
  } catch (err) {
    console.error("❌ Error uploading chapter:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
