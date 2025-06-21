const express = require("express");
const Notification = require("../models/Notification");
const router = express.Router();

// Get all notifications for a user
router.get("/user/:userId", async (req, res) => {
  const notes = await Notification.find({ user: req.params.userId }).sort({ createdAt: -1 });
  res.json(notes);
});

// Mark notification as read
router.post("/read/:id", async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { read: true });
  res.json({ message: "Marked as read" });
});

module.exports = router;
