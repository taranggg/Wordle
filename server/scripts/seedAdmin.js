const bcrypt = require("bcrypt");
const User = require("../models/user");

const DEFAULT_USERNAME = "admin";
const DEFAULT_EMAIL = "admin@wordle.local";
const DEFAULT_PASSWORD = "Admin@123";
const DEFAULT_FIRST_NAME = "Admin";

async function seedAdmin() {
  const username = process.env.ADMIN_USERNAME || DEFAULT_USERNAME;
  const email = process.env.ADMIN_EMAIL || DEFAULT_EMAIL;
  const plainPassword = process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD;
  const firstName = process.env.ADMIN_FIRST_NAME || DEFAULT_FIRST_NAME;

  const existing = await User.findOne({
    $or: [{ email: email.trim().toLowerCase() }, { username: username.trim() }],
  });
  if (existing) {
    return;
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(plainPassword, salt);
  await User.create({
    firstName: firstName.trim(),
    lastName: "",
    username: username.trim(),
    email: email.trim().toLowerCase(),
    password: hashedPassword,
  });
}

module.exports = { seedAdmin };
