const jwt = require("jsonwebtoken");
const User = require("../models/user");

const JWT_SECRET = process.env.JWT_SECRET || process.env.SECRET;

exports.protect = async (req, res, next) => {
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
    req.user = user;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Not authenticated." });
    }
    next(err);
  }
};
