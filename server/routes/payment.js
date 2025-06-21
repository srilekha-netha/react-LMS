const express = require("express");
const router = express.Router();

// List payment history for a user
router.get("/history/:userId", async (req, res) => {
  // Simulated payment data; normally query a Payment collection!
  res.json([
    { id: "p1", amount: 299, date: "2024-06-20", course: "React for Beginners", coupon: "WELCOME10", invoice: "/uploads/invoice1.pdf" },
    { id: "p2", amount: 599, date: "2024-06-01", course: "Node.js Mastery", coupon: "", invoice: "/uploads/invoice2.pdf" }
  ]);
});

module.exports = router;
