const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  amount: Number,
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Prevent OverwriteModelError
const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
module.exports = Payment;
