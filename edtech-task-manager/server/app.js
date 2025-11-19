const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

// TEST ROUTE
app.get("/", (req, res) =>
  res.json({ success: true, message: "API working" })
);

// ERROR HANDLER
app.use(errorHandler);

module.exports = app;
