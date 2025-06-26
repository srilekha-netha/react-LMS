const mongoose = require("mongoose");

// Define the schema for messages exchanged between users
const messageSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Sender (student or teacher)
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Receiver (student or teacher)
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course", // Optional: which course the message is about
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the model with the correct case-sensitive name
module.exports = mongoose.model("Message", messageSchema);
