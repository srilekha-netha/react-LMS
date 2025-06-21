const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: String,
  discount: Number, // percent
  expiresAt: Date,
  usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
});
module.exports = mongoose.model("Coupon", couponSchema);
