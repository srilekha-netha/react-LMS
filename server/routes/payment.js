const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");

router.get("/user/:userId", async (req, res) => {
  try {
    const payments = await Payment.find({ student: req.params.userId }).populate("course");
    res.json(payments);
  } catch (err) {
    console.error("❌ Failed to fetch payments:", err);
    res.status(500).json({ message: "Error fetching payments" });
  }
});

module.exports = router;
