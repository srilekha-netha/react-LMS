const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

<<<<<<< HEAD
// ✅ Enable CORS for frontend
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

=======
>>>>>>> fbd6d69c8e25ddd0059941aef24936dec5f7e1fa
// ✅ Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/lms", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

<<<<<<< HEAD
// ✅ API Routes
app.use("/api/auth", require("./routes/auth")); // Contains OTP routes now
=======

const adminLogsRoute = require("./routes/adminLogs");
app.use("/api/admin", adminLogsRoute);


// ✅ Routes
app.use("/api/auth", require("./routes/auth"));
>>>>>>> fbd6d69c8e25ddd0059941aef24936dec5f7e1fa
app.use("/api/courses", require("./routes/course"));
app.use("/api/enrollments", require("./routes/enrollment"));
app.use("/api/assignments", require("./routes/assignment"));
app.use("/api/coupons", require("./routes/coupon"));
app.use("/api/users", require("./routes/user"));
app.use("/api/messages", require("./routes/message"));
app.use("/api/notifications", require("./routes/notification"));
app.use("/api/payments", require("./routes/payment"));
<<<<<<< HEAD
app.use("/api/messages", require("./routes/message"));
=======

// ✅ Admin routes
const adminUsersRoute = require("./routes/usersadmin");
const adminStatsRoute = require("./routes/adminMetrics"); // ✅ This was missing before
app.use("/api/admin/users", adminUsersRoute);
app.use("/api/admin/onboarding", require("./routes/teacheradmin"));
app.use("/api/admin/reports", require("./routes/adminReports"));
app.use("/api/admin", adminStatsRoute); // ✅ This is the key line to fix your dashboard
>>>>>>> fbd6d69c8e25ddd0059941aef24936dec5f7e1fa

// ✅ Health check
app.get("/", (req, res) => res.send("✅ LMS API is running!"));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
