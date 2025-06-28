const express = require("express");
const Notification = require("../models/Notification");
const router = express.Router();

// ✅ Get all notifications for a user (most recent first)
router.get("/user/:userId", async (req, res) => {
  try {
    const notes = await Notification.find({ user: req.params.userId })
      .sort({ createdAt: -1 })
      .lean(); // good for performance
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
      { new: true } // return updated document
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

// ✅ Mark all notifications as read for a user
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
