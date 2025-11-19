const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");
dotenv.config();

exports.authenticate = async (req, res, next) => {
  try {
    const header = req.header("Authorization");
    if (!header)
      return res.status(401).json({ success: false, message: "No token" });

    const token = header.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user)
      return res.status(401).json({ success: false, message: "Invalid token" });

    req.user = user;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Token invalid or expired" });
  }
};
