const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  amount: Number,
  date: { type: Date, default: Date.now },
  coupon: String,
  invoice: String,
});

module.exports = mongoose.model("Payment", paymentSchema);
