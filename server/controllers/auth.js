const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const JWT_SECRET = process.env.JWT_SECRET || process.env.SECRET;
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  maxAge: 24 * 60 * 60 * 1000,
  path: "/",
};

function setAuthCookie(res, token) {
  res.cookie("wordle_token", token, COOKIE_OPTIONS);
}

function clearAuthCookie(res) {
  res.clearCookie("wordle_token", { ...COOKIE_OPTIONS, maxAge: 0 });
}

exports.signin = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    if (!emailOrUsername?.trim() || !password) {
      return res
        .status(400)
        .json({ message: "Email/username and password are required." });
    }

    const user = await User.findOne({
      $or: [
        { email: emailOrUsername.trim().toLowerCase() },
        { username: emailOrUsername.trim() },
      ],
    }).select("+password");

    const genericError = "Invalid email/username or password.";
    if (!user) {
      return res.status(401).json({ message: genericError });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: genericError });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "24h",
      algorithm: "HS256",
    });

    setAuthCookie(res, token);

    const safeUser = {
      id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
    };
    res.status(200).json({
      success: true,
      message: "Signed in successfully",
      user: safeUser,
    });
  } catch (_err) {
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, gender } = req.body;
    if (
      !firstName?.trim() ||
      !username?.trim() ||
      !email?.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "First name, username, email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: username.trim() }],
    });
    if (existing) {
      const field = existing.email === normalizedEmail ? "Email" : "Username";
      return res.status(409).json({ message: `${field} is already in use.` });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName: firstName.trim(),
      lastName: (lastName || "").trim(),
      username: username.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      gender: gender || undefined,
    });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "24h",
      algorithm: "HS256",
    });

    setAuthCookie(res, token);

    const safeUser = {
      id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
    };
    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: safeUser,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: err.message || "Validation failed." });
    }
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.me = async (req, res) => {
  try {
    const token =
      req.cookies?.wordle_token ||
      req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Not authenticated." });
    }

    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Not authenticated." });
    }
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.logout = (req, res) => {
  clearAuthCookie(res);
  res.status(200).json({ success: true, message: "Signed out." });
};
