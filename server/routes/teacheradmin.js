// server/routes/teacheradmin.js
const express = require("express");
const User    = require("../models/User");
const router  = express.Router();

router.get("/pending", async (req, res) => {
  console.log("▶️  [teacheradmin] GET /pending called");           // ← add this
  try {
    const pending = await User.find({ role: "teacher", verified: false })
                              .select("name email");
    console.log("▶️  [teacheradmin] pending:", pending);          // ← and this
    res.json(pending);
  } catch (err) {
    console.error("‼️ [teacheradmin] GET /pending error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id/verify", async (req, res) => {
  console.log(`▶️  [teacheradmin] PUT /${req.params.id}/verify called`);
  try {
    await User.findByIdAndUpdate(req.params.id, { verified: true });
    res.json({ message: "Teacher verified" });
  } catch (err) {
    console.error("‼️ [teacheradmin] PUT verify error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
