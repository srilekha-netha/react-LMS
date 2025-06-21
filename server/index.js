const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/lms", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log("MongoDB connection error:", err));

// Import routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/courses", require("./routes/course"));
app.use("/api/enrollments", require("./routes/enrollment"));
app.use("/api/assignments", require("./routes/assignment"));
app.use("/api/coupons", require("./routes/coupon"));
app.use("/api/notifications", require("./routes/notification"));
app.use("/api/users", require("./routes/user"));

app.get("/", (req, res) => res.send("LMS API running"));

app.listen(5000, () => console.log("Server running on port 5000"));
