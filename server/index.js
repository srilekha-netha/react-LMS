
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("Error: ", err));

// ✅ Import and use routes here
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);  // <- Add this line here

// Optional base route
app.get("/", (req, res) => {
  res.send("Forge LMS API running");
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
