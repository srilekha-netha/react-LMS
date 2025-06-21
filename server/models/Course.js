const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answer: String
});

const chapterSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
  pdfUrl: String,
  content: String,
  quiz: [quizSchema],
  locked: { type: Boolean, default: true }
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: String,
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  price: Number,
  thumbnail: String,
  published: { type: Boolean, default: false },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  chapters: [chapterSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);
