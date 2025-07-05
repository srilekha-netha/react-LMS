const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: function () {
      return this.isVerified;
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function () {
      return this.isVerified;
    },
  },
  otp: String,
  otpExpiresAt: Date,
  isVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["student", "teacher", "admin"],
    default: "student",
  },
  blocked: {
    type: Boolean,
    default: false,
  },
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notification" }],
});

module.exports = mongoose.model("User", userSchema);
