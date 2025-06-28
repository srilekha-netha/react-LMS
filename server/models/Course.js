const mongoose = require('mongoose');

// Quiz schema inside chapter
const quizSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answer: String
});

// Chapter schema including video, PDF, content, quiz and assignment
const chapterSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
  pdfUrl: String,
  content: String,
  quiz: [quizSchema],
  assignmentQuestion: String, // ✅ New field for assignments
  locked: { type: Boolean, default: true }
});

// Full Course schema
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: String,
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  price: Number,
  thumbnail: String,
  published: { type: Boolean, default: false },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: (value) => mongoose.Types.ObjectId.isValid(value),
      message: 'Invalid teacher ID'
    }
  },
  chapters: [chapterSchema], // Contains all chapter details including assignments
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);
