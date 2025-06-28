const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const Notification = require("../models/Notification");
const User = require("../models/User"); // 👈 Required to get sender name

// ✅ Send a message and create a notification
router.post("/send", async (req, res) => {
  const { from, to, content } = req.body;

  if (!from || !to || !content) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Create the message
    const msg = await Message.create({ from, to, content });

    // Get sender name for notification text
    const sender = await User.findById(from);

    // Create the notification for recipient
    const newNotification = new Notification({
      user: to,
      text: `📥 New message from ${sender?.name || "a user"}`,
      icon: "bi bi-chat-dots-fill",
      read: false,
    });

    await newNotification.save();

    res.status(201).json(msg);
  } catch (err) {
    console.error("❌ Error sending message:", err.message);
    res.status(500).json({ message: "Failed to send message" });
  }
});

// ✅ Get inbox messages
router.get("/inbox/:userId", async (req, res) => {
  try {
    const msgs = await Message.find({ to: req.params.userId })
      .populate("from", "name email")
      .sort({ createdAt: -1 });
    res.json(msgs);
  } catch (err) {
    console.error("❌ Error fetching inbox:", err.message);
    res.status(500).json({ message: "Failed to fetch inbox messages" });
  }
});

// ✅ Get sent messages
router.get("/sent/:userId", async (req, res) => {
  try {
    const msgs = await Message.find({ from: req.params.userId })
      .populate("to", "name email")
      .sort({ createdAt: -1 });
    res.json(msgs);
  } catch (err) {
    console.error("❌ Error fetching sent messages:", err.message);
    res.status(500).json({ message: "Failed to fetch sent messages" });
  }
});

module.exports = router;
