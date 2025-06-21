const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["student", "teacher", "admin"], default: "student" },
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notification" }],
});

module.exports = mongoose.model("User", userSchema);
