const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: `"LMS Verification" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP for Registration",
    html: `<h2>Your OTP Code is: <strong>${otp}</strong></h2><p>Valid for 10 minutes.</p>`,
  });
};

module.exports = sendOTP;
