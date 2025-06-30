const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  chaptersUnlocked: { type: Number, default: 1 }, // number of unlocked chapters
  completedQuizzes: [{ type: Number }], // store chapter IDs whose quizzes are completed
  progress: { type: Number, default: 0 }, // percent progress
  completed: { type: Boolean, default: false },
  paymentId: String, // Payment ref
});

module.exports = mongoose.model("Enrollment", enrollmentSchema);
