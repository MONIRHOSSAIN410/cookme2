import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log("ℹ️ No MONGODB_URI provided in environment. Utilizing in-memory database store with auto-persistence.");
    return false;
  }

  try {
    if (isConnected) return true;
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log("✅ MongoDB successfully connected via Mongoose");
    return true;
  } catch (error) {
    console.warn("⚠️ MongoDB connection failed, fallback to in-memory store:", (error as Error).message);
    return false;
  }
}
