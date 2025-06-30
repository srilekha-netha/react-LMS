const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");

// ✅ Get all payments made by a user
router.get("/user/:userId", async (req, res) => {
  try {
    const payments = await Payment.find({ student: req.params.userId }).populate("course");
    res.json(payments);
  } catch (err) {
    console.error("❌ Payment fetch error:", err);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
});

module.exports = router;
