/**
 * Seed Script - Create Test User for Development
 * Run: node scripts/seedTestUser.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const testUser = {
  name: "Test Farmer",
  email: "test@example.com",
  password: "Test@123",
  phone: "9876543210",
  role: "farmer",
  location: {
    state: "Maharashtra",
    district: "Pune",
    village: "Test Village",
  },
  farmSize: 5,
  farmSizeUnit: "acres",
  isActive: true,
  preferences: {
    language: "en",
    notifications: true,
    theme: "light",
  },
};

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    console.log("🔌 Connecting to MongoDB...");
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/smart-agro-data";

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");

    // Check if user already exists
    const existingUser = await User.findOne({ email: testUser.email });
    if (existingUser) {
      console.log("⚠️ Test user already exists!");
      console.log(`📧 Email: ${existingUser.email}`);
      console.log(`👤 Name: ${existingUser.name}`);
      console.log(`🆔 ID: ${existingUser._id}`);
      await mongoose.connection.close();
      process.exit(0);
    }

    // Create new user
    console.log("👤 Creating test user...");
    const user = await User.create(testUser);

    console.log("✅ Test user created successfully!");
    console.log("");
    console.log("📝 Test User Credentials:");
    console.log("─".repeat(50));
    console.log(`📧 Email:    ${testUser.email}`);
    console.log(`🔑 Password: ${testUser.password}`);
    console.log(`👤 Name:     ${testUser.name}`);
    console.log(`🆔 User ID:  ${user._id}`);
    console.log("─".repeat(50));
    console.log("");
    console.log("✨ You can now login with these credentials!");

    // Close connection
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
    process.exit(1);
  }
};

seedDatabase();
