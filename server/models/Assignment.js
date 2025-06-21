const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  chapter: Number,
  fileUrl: String,
  status: { type: String, enum: ["Not Submitted", "Submitted", "Graded"], default: "Not Submitted" },
  grade: String,
});
module.exports = mongoose.model("Assignment", assignmentSchema);
