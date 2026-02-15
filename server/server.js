const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/db");
const { seedAdmin } = require("./scripts/seedAdmin");
const authRouter = require("./routes/auth");
const gamesRouter = require("./routes/games");
const wordsRouter = require("./routes/words");
const leaderboardRouter = require("./routes/leaderboard");

const app = express();

dotenv.config({ path: "./config/config.env" });

const frontendOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin: frontendOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.get("/", (req, res) => {
  res.send("Welcome to the Wordle API");
});

app.use("/api/auth", authRouter);
app.use("/api/games", gamesRouter);
app.use("/api/words", wordsRouter);
app.use("/api/leaderboard", leaderboardRouter);

async function start() {
  await connectDB();
  await seedAdmin();
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
}
start();
