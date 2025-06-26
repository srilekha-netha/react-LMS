const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// ✅ Send a message
router.post("/send", async (req, res) => {
  const { from, to, content } = req.body;
  if (!from || !to || !content) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const msg = await Message.create({ from, to, content });
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ message: "Failed to send message" });
  }
});


// ✅ Get inbox messages
router.get("/inbox/:userId", async (req, res) => {
  try {
    const msgs = await Message.find({ to: req.params.userId })
      .populate("from", "name email") // populate only necessary fields
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
