// server/routes/payment.js
const express  = require("express");
const Razorpay = require("razorpay");
const crypto   = require("crypto");
const router   = express.Router();
const Payment  = require("../models/Payment");

// 🔑 Your test keys
const razorpay = new Razorpay({
  key_id:     "rzp_test_dGFALpaB5MZyZr",
  key_secret: "xYtYqMFa9CoSVbDwL1X1JJ6p",
});

// POST /api/payments/create-order
router.post("/create-order", async (req, res) => {
  const { amount } = req.body;
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });
    res.json(order);
  } catch (err) {
    console.error("❌ Razorpay Order Error:", err);
    res.status(500).json({ message: "Failed to create order" });
  }
});

// POST /api/payments/verify
router.post("/verify", async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    userId,    // ← we expect “userId” from client
    courseId,
    amount,
  } = req.body;

  // 1. Signature check
  const generatedSignature = crypto
    .createHmac("sha256", razorpay.key_secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    return res.status(400).json({ message: "Invalid payment signature" });
  }

  // 2. Save Payment document
  try {
    const payment = new Payment({
      student:   userId,                       // now correct
      course:    courseId,
      amount,
      paymentId: razorpay_payment_id,
      orderId:   razorpay_order_id,            // required by schema
      invoice:   razorpay_order_id,            // if you want same as order
      status:    "paid",
    });

    await payment.save();
    res.json({ message: "Payment verified and saved successfully" });
  } catch (err) {
    console.error("❌ Payment Save Error:", err);
    res.status(500).json({ message: "Failed to save payment" });
  }
});

// GET /api/payments/user/:userId
router.get("/user/:userId", async (req, res) => {
  try {
    const payments = await Payment.find({ student: req.params.userId })
      .populate("course", "title");
    res.json(payments);
  } catch (err) {
    console.error("❌ Failed to fetch user payments:", err);
    res.status(500).json({ message: "Error fetching payments" });
  }
});

// GET /api/payments/all
router.get("/all", async (_req, res) => {
  try {
    const payments = await Payment.find()
      .sort({ date: -1 })
      .populate("student", "name email")
      .populate("course", "title");
    res.json(payments);
  } catch (err) {
    console.error("❌ Failed to fetch all payments:", err);
    res.status(500).json({ message: "Error fetching payments" });
  }
});

module.exports = router;
