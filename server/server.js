require("dotenv").config({ path: "./config/config.env" });

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { connectDB } = require("./config/db");
const { seedAdmin } = require("./scripts/seedAdmin");
const authRouter = require("./routes/auth");
const gamesRouter = require("./routes/games");
const wordsRouter = require("./routes/words");
const leaderboardRouter = require("./routes/leaderboard");

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 5000;
const FRONTEND_ORIGIN =
  (process.env.FRONTEND_ORIGIN && process.env.FRONTEND_ORIGIN.trim()) ||
  "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined"));
}

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.get("/", (req, res) => {
  res.send("Wordle API");
});

app.get("/health", (req, res) => {
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
    return res.status(404).json({ message: "Not found" });
  }
  res.status(404).send("Not found");
});

let server;

async function start() {
  await connectDB();
  await seedAdmin().catch(() => {});
  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

function shutdown(signal) {
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
