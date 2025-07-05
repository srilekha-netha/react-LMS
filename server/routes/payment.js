const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const router = express.Router();
const Payment = require("../models/payment");

// ✅ Razorpay instance (Test mode)
const razorpay = new Razorpay({
  key_id: "rzp_test_dGFALpaB5MZyZr",
  key_secret: "xYtYqMFa9CoSVbDwL1X1JJ6p",
});

// 🔹 Create Razorpay Order
router.post("/create-order", async (req, res) => {
  const { amount, receipt } = req.body;

  console.log("📦 Received amount from frontend:", amount);

  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: "❌ Invalid or missing amount" });
  }

  const options = {
    amount: amount * 100, // convert rupees to paise
    currency: "INR",
    receipt: receipt || `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    console.log("✅ Razorpay order created:", order.id);
    res.json(order);
  } catch (err) {
    console.error("❌ Razorpay Order Error:", err);
    res.status(500).json({ message: "Failed to create Razorpay order" });
  }
});

// 🔹 Verify Razorpay Payment and Save to DB
router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      courseId,
      amount,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userId || !courseId || !amount) {
      return res.status(400).json({ message: "❌ Missing payment or user data" });
    }

    const hmac = crypto.createHmac("sha256", razorpay.key_secret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "❌ Invalid Razorpay signature" });
    }

    const payment = new Payment({
      student: userId,
      course: courseId,
      amount,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      receipt: `receipt_${Date.now()}`,
      status: "paid",
    });

    await payment.save();
    console.log("✅ Payment verified & saved:", razorpay_payment_id);
    res.json({ message: "Payment verified and saved successfully" });
  } catch (err) {
    console.error("❌ Payment Save Error:", err);
    res.status(500).json({ message: "Failed to verify/save payment" });
  }
});

// 🔹 Get payments for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const payments = await Payment.find({ student: req.params.userId }).populate("course");
    res.json(payments);
  } catch (err) {
    console.error("❌ Failed to fetch user payments:", err);
    res.status(500).json({ message: "Error fetching payment history" });
  }
});

module.exports = router;
