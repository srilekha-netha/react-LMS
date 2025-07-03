// routes/adminLogs.js
const express = require("express");
const router = express.Router();
const Log = require("../models/Log");

// GET /api/admin/logs
router.get("/logs", async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    console.error("❌ Error fetching logs:", err);
    res.status(500).json({ message: "Failed to fetch logs" });
  }
});

module.exports = router;
