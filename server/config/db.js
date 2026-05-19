/**
 * Database Configuration
 * Connects to MongoDB Atlas with retry logic
 */
const mongoose = require("mongoose");

const normalizeUri = (uri) =>
  uri
    .trim()
    .replace(/;$/, "")
    .replace(/^['"]|['"]$/g, "");

const connectDB = async () => {
  try {
    const primaryUri = process.env.MONGODB_URI
      ? normalizeUri(process.env.MONGODB_URI)
      : "";
    const fallbackUri = "mongodb://127.0.0.1:27017/smart-agro-data";
    const connectionCandidates = [primaryUri, fallbackUri].filter(Boolean);

    if (connectionCandidates.length === 0) {
      throw new Error("MONGODB_URI is not configured");
    }

    let lastError;
    for (const mongoUri of connectionCandidates) {
      try {
        const conn = await mongoose.connect(mongoUri, {
          serverSelectionTimeoutMS: 5000,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        // Handle connection events
        mongoose.connection.on("error", (err) => {
          console.error("❌ MongoDB connection error:", err);
        });

        mongoose.connection.on("disconnected", () => {
          console.warn("⚠️ MongoDB disconnected. Attempting to reconnect...");
        });

        return conn;
      } catch (error) {
        lastError = error;
        console.warn(
          `⚠️ MongoDB connection failed for ${mongoUri}: ${error.message}`,
        );
      }
    }

    throw lastError || new Error("Unable to connect to MongoDB");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;
