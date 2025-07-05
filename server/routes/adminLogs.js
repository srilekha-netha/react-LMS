// routes/adminLogs.js
const express = require("express");
const router = express.Router();
const Log = require("../models/Log");

// ✅ GET /api/admin/logs
router.get("/logs", async (req, res) => {
  try {
    console.log("📥 /api/admin/logs route hit");
    const logs = await Log.find().sort({ timestamp: -1 }).limit(100);
    console.log("✅ Logs fetched:", logs.length);
    res.json(logs);
  } catch (err) {
    console.error("❌ Logs fetch error:", err);
    res.status(500).json({ message: "Server failed to fetch logs", error: err.message });
  }
});


module.exports = router;
