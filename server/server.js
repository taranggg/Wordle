const express = require("express");
const dotenv = require("dotenv");
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

dotenv.config({ path: "./config/config.env" });

const defaultOrigin = "http://localhost:5173";
const frontendOrigins = (process.env.FRONTEND_ORIGIN || defaultOrigin)
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

function isAllowedOrigin(origin) {
  if (!origin) return true;
  return (
    frontendOrigins.includes(origin) ||
    origin === defaultOrigin ||
    origin === "http://127.0.0.1:5173"
  );
}

app.use((req, res, next) => {
  if (req.method !== "OPTIONS") return next();
  const origin = req.headers.origin;
  if (isAllowedOrigin(origin)) {
    res.setHeader(
      "Access-Control-Allow-Origin",
      origin || frontendOrigins[0] || defaultOrigin,
    );
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Max-Age", "86400");
  return res.status(204).end();
});

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, frontendOrigins[0] || defaultOrigin);
    return cb(null, isAllowedOrigin(origin) ? origin : false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined"));
}

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.get("/", (req, res) => {
  res.send("Welcome to the Wordle API");
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

app.use(/^\/api\/.+/, (req, res) => {
  res.status(404).json({ message: "Not found" });
});

let server;

async function start() {
  await connectDB();
  await seedAdmin().catch(() => {});
  const port = parseInt(process.env.PORT, 10) || 5000;
  server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

function shutdown(signal) {
  return () => {
    console.log(`${signal} received, shutting down gracefully`);
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
