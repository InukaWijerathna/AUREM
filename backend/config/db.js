const mongoose = require('mongoose');

// Cache the connection across serverless function invocations.
// Without this, every cold-start on Vercel opens a new connection.
let isConnected = 0;

const connectDB = async () => {
  if (isConnected === 1) return;

  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState;
    console.log(`MongoDB connected: ${db.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    // process.exit kills a serverless function permanently — throw instead
    throw new Error(`MongoDB connection failed: ${err.message}`);
  }
};

module.exports = connectDB;
