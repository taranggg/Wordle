import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { env } from "../config/env.js";
import { getGoogleAuthToken } from "../config/passport.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: (env.NODE_ENV === "production" ? "strict" : "lax") as
    | "strict"
    | "lax",
  maxAge: 24 * 60 * 60 * 1000,
  path: "/",
};

function setAuthCookie(res: Response, token: string): void {
  res.cookie("wordle_token", token, COOKIE_OPTIONS);
}

function clearAuthCookie(res: Response): void {
  res.clearCookie("wordle_token", { ...COOKIE_OPTIONS, maxAge: 0 });
}

function toSafeUser(user: {
  _id: unknown;
  username: string;
  email: string;
  firstName: string;
  lastName?: string;
  avatar?: string;
}) {
  return {
    id: String(user._id),
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: user.avatar,
  };
}

export async function signin(req: Request, res: Response): Promise<void> {
  try {
    const { emailOrUsername, password } = req.body as {
      emailOrUsername?: string;
      password?: string;
    };
    if (!emailOrUsername?.trim() || !password) {
      res.status(400).json({
        message: "Email/username and password are required.",
      });
      return;
    }

    const user = await User.findOne({
      $or: [
        { email: emailOrUsername.trim().toLowerCase() },
        { username: emailOrUsername.trim() },
      ],
    }).select("+password");

    const genericError = "Invalid email/username or password.";
    if (!user) {
      res.status(401).json({ message: genericError });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password!);
    if (!isPasswordCorrect) {
      res.status(401).json({ message: genericError });
      return;
    }

    const token = jwt.sign({ id: String(user._id) }, env.JWT_SECRET, {
      expiresIn: "24h",
      algorithm: "HS256",
    });

    setAuthCookie(res, token);
    res.status(200).json({
      success: true,
      message: "Signed in successfully",
      user: toSafeUser(user),
    });
  } catch {
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function signup(req: Request, res: Response): Promise<void> {
  try {
    const { firstName, lastName, username, email, password, gender } =
      req.body as {
        firstName?: string;
        lastName?: string;
        username?: string;
        email?: string;
        password?: string;
        gender?: string;
      };
    if (
      !firstName?.trim() ||
      !username?.trim() ||
      !email?.trim() ||
      !password
    ) {
      res.status(400).json({
        message: "First name, username, email and password are required.",
      });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: username.trim() }],
    });
    if (existing) {
      const field = existing.email === normalizedEmail ? "Email" : "Username";
      res.status(409).json({ message: `${field} is already in use.` });
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName: firstName.trim(),
      lastName: (lastName ?? "").trim(),
      username: username.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      gender: gender || undefined,
    });

    const token = jwt.sign({ id: String(user._id) }, env.JWT_SECRET, {
      expiresIn: "24h",
      algorithm: "HS256",
    });

    setAuthCookie(res, token);
    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: toSafeUser(user),
    });
  } catch (err) {
    const e = err as Error & { name?: string };
    if (e.name === "ValidationError") {
      res.status(400).json({ message: e.message ?? "Validation failed." });
      return;
    }
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function me(req: Request, res: Response): Promise<void> {
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

    res.status(200).json({
      success: true,
      user: toSafeUser(user),
    });
  } catch (err) {
    const e = err as Error & { name?: string };
    if (e.name === "JsonWebTokenError" || e.name === "TokenExpiredError") {
      res.status(401).json({ message: "Not authenticated." });
      return;
    }
    res.status(500).json({ message: "Internal server error." });
  }
}

export function logout(_req: Request, res: Response): void {
  clearAuthCookie(res);
  res.status(200).json({ success: true, message: "Signed out." });
}

export function googleCallback(req: Request, res: Response): void {
  const user = req.user as
    | {
        _id: unknown;
        username: string;
        email: string;
        firstName: string;
        lastName?: string;
        avatar?: string;
      }
    | undefined;
  if (!user) {
    res.redirect(`${env.FRONTEND_ORIGIN}/login?error=google`);
    return;
  }
  const token = getGoogleAuthToken(user);
  setAuthCookie(res, token);
  res.redirect(env.FRONTEND_ORIGIN);
}
