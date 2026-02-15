const { body, validationResult } = require("express-validator");

const signinValidation = [
  body("emailOrUsername")
    .trim()
    .notEmpty()
    .withMessage("Email or username is required")
    .isLength({ max: 256 }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 1, max: 256 }),
];

const signupValidation = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 1, max: 100 })
    .escape(),
  body("lastName").trim().isLength({ max: 100 }).escape(),
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 2, max: 50 })
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      "Username can only contain letters, numbers, underscore and hyphen",
    ),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be 8–128 characters")
    .matches(/^(?=.*[A-Za-z])(?=.*\d).{8,128}$/)
    .withMessage("Password must contain at least one letter and one number"),
  body("gender")
    .optional()
    .trim()
    .isIn(["male", "female", "other", "preferNotToSay", ""]),
];

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const first = errors.array()[0];
    return res.status(400).json({ message: first.msg });
  }
  next();
}

module.exports = {
  signinValidation,
  signupValidation,
  handleValidationErrors,
};
