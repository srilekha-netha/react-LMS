const express = require("express");
const Notification = require("../models/Notification");
const router = express.Router();

// ✅ SEND a notification (used for assignment submissions, messages, etc.)
router.post("/send", async (req, res) => {
  const { user, text, icon } = req.body;

  if (!user || !text) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newNotification = new Notification({
      user,
      text,
      icon: icon || "bi bi-bell",
      read: false,
    });

    const saved = await newNotification.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({
      message: "Failed to create notification",
      error: err.message,
    });
  }
});

// ✅ Get all notifications for a user (most recent first)
router.get("/user/:userId", async (req, res) => {
  try {
    const notes = await Notification.find({ user: req.params.userId })
      .sort({ createdAt: -1 })
      .lean(); // performance
    res.json(notes);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch notifications",
      error: err.message,
    });
  }
});

// ✅ Mark a specific notification as read
router.post("/read/:id", async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Notification marked as read", data: updated });
  } catch (err) {
    res.status(500).json({
      message: "Failed to mark as read",
      error: err.message,
    });
  }
});

// ✅ Mark ALL notifications as read for a user
router.post("/read-all/:userId", async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.params.userId, read: false },
      { read: true }
    );
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to mark all as read",
      error: err.message,
    });
  }
});

module.exports = router;
