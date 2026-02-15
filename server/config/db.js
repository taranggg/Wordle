const mongoose = require("mongoose");

exports.connectDB = async () => {
  const url = process.env.MONGO_URL;
  if (!url || !url.trim()) {
    console.error("MONGO_URL is not set.");
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(url);
    console.log(`Connected to MongoDB: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
