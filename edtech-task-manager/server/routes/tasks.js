const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const User = require("../models/User");
const { authenticate } = require("../middleware/auth");
const { taskValidator } = require("../utils/validators");
const { validationResult } = require("express-validator");

// GET TASKS
router.get("/", authenticate, async (req, res) => {
  const user = req.user;

  if (user.role === "student") {
    const tasks = await Task.find({ userId: user._id });
    return res.json({ success: true, tasks });
  }

  if (user.role === "teacher") {
    const students = await User.find({ teacherId: user._id });
    const studentIds = students.map((s) => s._id);

    const tasks = await Task.find({
      $or: [{ userId: user._id }, { userId: { $in: studentIds } }]
    });

    return res.json({ success: true, tasks });
  }
});

// CREATE
router.post("/", authenticate, taskValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, message: errors.array()[0].msg });

  const { title, description, dueDate } = req.body;

  const task = new Task({
    userId: req.user._id,
    title,
    description,
    dueDate
  });

  await task.save();
  res.json({ success: true, task });
});

// UPDATE
router.put("/:id", authenticate, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task)
    return res.status(404).json({ success: false, message: "Task not found" });

  if (task.userId.toString() !== req.user._id.toString())
    return res
      .status(403)
      .json({ success: false, message: "Not authorized" });

  await Task.findByIdAndUpdate(req.params.id, req.body);
  res.json({ success: true, message: "Task updated" });
});

// DELETE
router.delete("/:id", authenticate, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task)
    return res.status(404).json({ success: false, message: "Task not found" });

  if (task.userId.toString() !== req.user._id.toString())
    return res
      .status(403)
      .json({ success: false, message: "Not authorized" });

  await Task.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Task deleted" });
});

module.exports = router;
