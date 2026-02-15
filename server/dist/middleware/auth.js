import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { env } from "../config/env.js";
export async function protect(req, res, next) {
    try {
        const token = req.cookies?.wordle_token ??
            req.headers.authorization?.replace("Bearer ", "");
        if (!token) {
            res.status(401).json({ message: "Not authenticated." });
            return;
        }
        const decoded = jwt.verify(token, env.JWT_SECRET, {
            algorithms: ["HS256"],
        });
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            res.status(401).json({ message: "User not found." });
            return;
        }
        req.user = user;
        next();
    }
    catch (err) {
        const e = err;
        if (e.name === "JsonWebTokenError" || e.name === "TokenExpiredError") {
            res.status(401).json({ message: "Not authenticated." });
            return;
        }
        next(err);
    }
}
//# sourceMappingURL=auth.js.map