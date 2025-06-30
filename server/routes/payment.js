// server/routes/payment.js
const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const router = express.Router();
const Payment = require("../models/Payment");

// ✅ Razorpay instance (Test Mode)
const razorpay = new Razorpay({
  key_id: "rzp_test_dGFALpaB5MZyZr",
  key_secret: "xYtYqMFa9CoSVbDwL1X1JJ6p",
});

// ✅ Create Razorpay Order
router.post("/create-order", async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // in paise
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error("❌ Razorpay Order Error:", err);
    res.status(500).json({ message: "Failed to create order" });
  }
});

// ✅ Verify Payment Signature
router.post("/verify", async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    studentId,
    courseId,
    amount,
  } = req.body;

  const key_secret = "xYtYqMFa9CoSVbDwL1X1JJ6p";
  const hmac = crypto.createHmac("sha256", key_secret);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const generatedSignature = hmac.digest("hex");

  if (generatedSignature !== razorpay_signature) {
    return res.status(400).json({ message: "Invalid payment signature" });
  }

  try {
    const payment = new Payment({
      student: studentId,
      course: courseId,
      amount,
      invoice: razorpay_order_id,
      paymentId: razorpay_payment_id,
      status: "paid",
    });

    await payment.save();
    res.json({ message: "Payment verified and saved successfully" });
  } catch (err) {
    console.error("❌ Payment Save Error:", err);
    res.status(500).json({ message: "Failed to save payment" });
  }
});

// ✅ Get payments by user
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
