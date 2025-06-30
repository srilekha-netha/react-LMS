const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const Course = require("../models/Course");
const User = require("../models/User");

// ✅ Get payment history for a user
router.get("/history/:userId", async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.params.userId })
      .populate("courseId", "title")
      .sort({ date: -1 });

    const result = payments.map(p => ({
      id: p._id,
      amount: p.amount,
      date: p.date,
      course: p.courseId?.title || "Unknown",
      coupon: p.couponCode || "",
      invoice: p.invoiceUrl || null,
    }));

    res.json(result);
  } catch (err) {
    console.error("❌ Failed to fetch payment history:", err);
    res.status(500).json({ message: "Failed to fetch payment history" });
  }
});

// ✅ Admin: Get all payments
router.get("/admin/payments", async (req, res) => {
  try {
    const payments = await Payment.find({})
      .populate("courseId", "title teacher")
      .populate("userId", "name");

    const formatted = await Promise.all(
      payments.map(async (p) => {
        const teacher = await User.findById(p.courseId?.teacher);
        return {
          _id: p._id,
          courseTitle: p.courseId?.title || "Unknown",
          teacherName: teacher?.name || "Unknown",
          amount: p.amount,
          date: p.date,
          status: p.status || "Success",
          payoutStatus: p.payoutStatus || "Pending",
        };
      })
    );

    res.json(formatted);
  } catch (err) {
    console.error("❌ Admin failed to fetch payments:", err);
    res.status(500).json({ message: "Error fetching admin payments" });
  }
});

// ✅ Admin: Export payments to CSV
const { Parser } = require("json2csv");
router.get("/admin/payments/export", async (req, res) => {
  try {
    const payments = await Payment.find({})
      .populate("courseId", "title teacher")
      .populate("userId", "name");

    const rows = await Promise.all(
      payments.map(async (p) => {
        const teacher = await User.findById(p.courseId?.teacher);
        return {
          Teacher: teacher?.name || "Unknown",
          Course: p.courseId?.title || "Unknown",
          Amount: p.amount,
          Date: new Date(p.date).toLocaleDateString(),
          Status: p.status,
          Payout: p.payoutStatus || "Pending",
        };
      })
    );

    const parser = new Parser();
    const csv = parser.parse(rows);

    res.setHeader("Content-disposition", "attachment; filename=earnings_report.csv");
    res.set("Content-Type", "text/csv");
    res.status(200).send(csv);
  } catch (err) {
    console.error("❌ Failed to export payments:", err);
    res.status(500).json({ message: "Error generating report" });
  }
});

// ✅ Admin: Approve payout
router.put("/admin/payments/:id/approve", async (req, res) => {
  try {
    await Payment.findByIdAndUpdate(req.params.id, {
      payoutStatus: "Paid",
    });
    res.json({ message: "Payout marked as paid" });
  } catch (err) {
    console.error("❌ Failed to approve payout:", err);
    res.status(500).json({ message: "Failed to approve payout" });
  }
});

module.exports = router;
