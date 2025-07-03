const express = require("express");
const User    = require("../models/User");
const router  = express.Router();

// 1️⃣ GET /api/admin/users
//    Return only students & teachers (we’ll filter out admins here)
router.get("/", async (req, res) => {
  console.log("🔍 GET /api/admin/users called");
  try {
    const users = await User.find({ role: { $in: ["student","teacher"] } })
                            .select("-password");
    console.log("🔍 Found users:", users);
    res.json(users);
  } catch (err) {
    console.error("⛔ admin/users GET error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// 2️⃣ PUT /api/admin/users/:userId/role
//    Change their role
router.put("/:userId/role", async (req, res) => {
  try {
    const { role } = req.body;
    await User.findByIdAndUpdate(req.params.userId, { role });
    res.json({ message: "Role updated" });
  } catch (err) {
    res.status(500).json({ message: "Error updating role" });
  }
});

// 3️⃣ PUT /api/admin/users/:userId/block
//    Toggle the blocked flag
router.put("/:userId/block", async (req, res) => {
  try {
    const { blocked } = req.body;
    await User.findByIdAndUpdate(req.params.userId, { blocked });
    res.json({ message: "Block status updated" });
  } catch (err) {
    res.status(500).json({ message: "Error updating block status" });
  }
});

// 4️⃣ DELETE /api/admin/users/:userId
//    Remove the user entirely
router.delete("/:userId", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

module.exports = router;
