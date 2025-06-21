const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const messageSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  content: String,
  createdAt: { type: Date, default: Date.now },
});
const Message = mongoose.model("Message", messageSchema);

// Get all messages for a user (inbox)
router.get("/inbox/:userId", async (req, res) => {
  const msgs = await Message.find({ to: req.params.userId }).populate("from");
  res.json(msgs);
});

// Get all messages sent by user
router.get("/sent/:userId", async (req, res) => {
  const msgs = await Message.find({ from: req.params.userId }).populate("to");
  res.json(msgs);
});

// Send a message (student to teacher)
router.post("/send", async (req, res) => {
  const { from, to, course, content } = req.body;
  const m = new Message({ from, to, course, content });
  await m.save();
  res.json({ message: "Message sent" });
});

module.exports = router;
