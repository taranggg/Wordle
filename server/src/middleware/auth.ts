import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { env } from "../config/env.js";
import { IUser } from "../models/User.js";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export async function protect(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token =
      req.cookies?.wordle_token ??
      req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      res.status(401).json({ message: "Not authenticated." });
      return;
    }
    const decoded = jwt.verify(token, env.JWT_SECRET, {
      algorithms: ["HS256"],
    }) as { id: string };
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      res.status(401).json({ message: "User not found." });
      return;
    }
    req.user = user;
    next();
  } catch (err) {
    const e = err as Error & { name?: string };
    if (e.name === "JsonWebTokenError" || e.name === "TokenExpiredError") {
      res.status(401).json({ message: "Not authenticated." });
      return;
    }
    next(err);
  }
}
