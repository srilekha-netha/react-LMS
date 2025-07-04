const User = require("../models/User");
const bcrypt = require("bcryptjs");
const sendOTP = require("../utils/sendEmail");

exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiresAt = Date.now() + 10 * 60 * 1000;

  let user = await User.findOne({ email });

  if (!user) {
    user = new User({ email });
  }

  user.otp = otp;
  user.otpExpiresAt = otpExpiresAt;
  await user.save();

  await sendOTP(email, otp);

  res.json({ success: true, message: "OTP sent to email" });
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.otp !== otp || Date.now() > user.otpExpiresAt) {
    return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
  }

  user.isVerified = true;
  user.otp = null;
  user.otpExpiresAt = null;
  await user.save();

  res.json({ success: true, message: "OTP verified" });
};

exports.setPassword = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !user.isVerified) {
    return res.status(400).json({ success: false, message: "Email not verified" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  await user.save();

  res.json({ success: true, message: "Password set successfully. Registration complete." });
};
