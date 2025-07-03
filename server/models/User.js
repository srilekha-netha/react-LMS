// server/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  role:      { type: String, enum: ["student","teacher","admin"], default: "student" },
  blocked:   { type: Boolean, default: false },
  verified:  { type: Boolean, default: false }, 
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notification" }]
});

module.exports = mongoose.model("User", userSchema);
