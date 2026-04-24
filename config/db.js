const mongoose = require("mongoose");

async function connectDB() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing");
    }

      await mongoose.connect(process.env.MONGODB_URI, {
        autoIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      
    });

    console.log("🍃 MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
