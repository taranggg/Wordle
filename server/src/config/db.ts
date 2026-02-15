import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDB(): Promise<void> {
  if (!env.MONGO_URL) {
    console.error("MONGO_URL is not set.");
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(env.MONGO_URL);
    console.log(`Connected to MongoDB: ${conn.connection.host}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("MongoDB connection failed:", message);
    process.exit(1);
  }
}
