// server/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
<<<<<<< HEAD
  name: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String },

  // 🔐 New fields for OTP verification
  otp: { type: String },
  otpExpiresAt: { type: Date },
  isVerified: { type: Boolean, default: false },

  role: { type: String, enum: ["student", "teacher", "admin"], default: "student" },
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notification" }],
=======
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  role:      { type: String, enum: ["student","teacher","admin"], default: "student" },
  blocked:   { type: Boolean, default: false },
  verified:  { type: Boolean, default: false }, 
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notification" }]
>>>>>>> fbd6d69c8e25ddd0059941aef24936dec5f7e1fa
});

module.exports = mongoose.model("User", userSchema);
