const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const app = express();

// ✅ Enable CORS for frontend
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// ✅ Middleware
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/lms", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log("MongoDB connection error:", err));

// ✅ API Routes
app.use("/api/auth", require("./routes/auth")); // Contains OTP routes now
app.use("/api/courses", require("./routes/course"));
app.use("/api/enrollments", require("./routes/enrollment"));
app.use("/api/assignments", require("./routes/assignment"));
app.use("/api/coupons", require("./routes/coupon"));
app.use("/api/notifications", require("./routes/notification"));
app.use("/api/users", require("./routes/user"));
app.use("/api/payments", require("./routes/payment"));
app.use("/api/messages", require("./routes/message"));

// ✅ Health check
app.get("/", (req, res) => res.send("LMS API running"));

// ✅ Start server
app.listen(5000, () => console.log("Server running on port 5000"));
