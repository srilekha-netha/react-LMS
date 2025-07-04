const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  action: String,
  user: String,
  role: String,
  ip: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Log", logSchema);
