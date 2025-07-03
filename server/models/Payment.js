// server/models/Payment.js
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  course:  { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  amount:  { type: Number, required: true },         // in rupees
  coupon:  { type: String, default: null },
  paymentId: { type: String, required: true },       // Razorpay payment ID
  orderId:   { type: String, required: true },       // Razorpay order ID
  receipt:   { type: String },                       // your generated receipt ID
  status:    { type: String, default: "created" },   // created, paid, failed, etc.
  date:      { type: Date, default: Date.now },
  invoice:   { type: String, default: null },        // optional: for invoice URL
});

module.exports = mongoose.model("Payment", paymentSchema);
