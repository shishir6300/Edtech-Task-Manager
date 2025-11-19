const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { signupValidator, loginValidator } = require("../utils/validators");
const { validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 60000,
  max: 10,
  message: { success: false, message: "Too many attempts, try later" }
});

// SIGNUP
router.post("/signup", signupValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, message: errors.array()[0].msg });

  const { email, password, role, teacherId } = req.body;

  if (role === "student" && !teacherId)
    return res.status(400).json({
      success: false,
      message: "Students must include teacherId"
    });

  const exists = await User.findOne({ email });
  if (exists)
    return res
      .status(400)
      .json({ success: false, message: "Email already used" });

  const passwordHash = await bcrypt.hash(password, 10);

  const user = new User({
    email,
    passwordHash,
    role,
    teacherId: role === "student" ? teacherId : undefined
  });

  await user.save();
  res.json({ success: true, message: "User created" });
});

// LOGIN
router.post("/login", loginLimiter, loginValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, message: errors.array()[0].msg });

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(400)
      .json({ success: false, message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match)
    return res
      .status(400)
      .json({ success: false, message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRES_IN
  });

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      teacherId: user.teacherId
    }
  });
});

// Get all teachers for dropdown
router.get("/teachers", async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" }).select("_id email");
    res.json({ success: true, teachers });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});


module.exports = router;
