import "./config/env.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import { seedAdmin } from "./scripts/seedAdmin.js";
import authRouter from "./routes/auth.js";
import gamesRouter from "./routes/games.js";
import wordsRouter from "./routes/words.js";
import leaderboardRouter from "./routes/leaderboard.js";
import { env } from "./config/env.js";

const app = express();

app.use(
  cors({
    origin: env.FRONTEND_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

if (env.NODE_ENV !== "test") {
  app.use(morgan("combined"));
}

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.get("/", (_req, res) => {
  res.send("Wordle API");
});

app.get("/health", (_req, res) => {
  const ok = mongoose.connection.readyState === 1;
  res.status(ok ? 200 : 503).json({ status: ok ? "ok" : "unhealthy" });
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: "Too many requests. Try again later." },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === "OPTIONS",
});

app.use("/api", apiLimiter);
app.use("/api/auth", authRouter);
app.use("/api/games", gamesRouter);
app.use("/api/words", wordsRouter);
app.use("/api/leaderboard", leaderboardRouter);

app.use((req, res) => {
  if (req.path.indexOf("/api") === 0) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  res.status(404).send("Not found");
});

let server: ReturnType<typeof app.listen> | null = null;

async function start(): Promise<void> {
  await connectDB();
  await seedAdmin().catch(() => {});
  server = app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
}

function shutdown(signal: string): () => void {
  return () => {
    console.log(`${signal} received, shutting down`);
    if (server) {
      server.close(() => {
        mongoose.connection.close().then(() => process.exit(0));
      });
      setTimeout(() => process.exit(1), 10000);
    } else {
      process.exit(0);
    }
  };
}

process.on("SIGTERM", shutdown("SIGTERM"));
process.on("SIGINT", shutdown("SIGINT"));

start();
