const { body } = require("express-validator");

exports.signupValidator = [
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  body("role").isIn(["student", "teacher"])
];

exports.loginValidator = [
  body("email").isEmail(),
  body("password").exists()
];

exports.taskValidator = [
  body("title").notEmpty()
];
