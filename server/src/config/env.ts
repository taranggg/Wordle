import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), "config", "config.env"),
});

export const env = {
  PORT: parseInt(process.env.PORT ?? "5000", 10),
  NODE_ENV: process.env.NODE_ENV ?? "development",
  MONGO_URL: (process.env.MONGO_URL ?? "").trim(),
  JWT_SECRET: (process.env.JWT_SECRET ?? process.env.SECRET ?? "").trim(),
  FRONTEND_ORIGIN: (
    process.env.FRONTEND_ORIGIN ?? "http://localhost:5173"
  ).trim(),
} as const;
