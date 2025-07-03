// server/seedAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");
const User     = require("./models/User");

async function run() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const hashed = await bcrypt.hash("YourSecureP@ssw0rd", 10);

  const exists = await User.findOne({ email: "admin@yourdomain.com" });
  if (exists) {
    console.log("Admin already exists");
  } else {
    await User.create({
      name:  "Admin",
      email: "admin@yourdomain.com",
      password: hashed,
      role:  "admin",
      verified: true,
      blocked:  false
    });
    console.log("✅ Admin user created");
  }

  process.exit();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
