import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

// Database connection URL
const cloudUrl=process.env.MONGO_URL;
// const url = 'mongodb://localhost:27017/jobPortal'; // Your MongoDB connection URL
export let db; // To hold the database instance

export const connectDB = async () => {
  try {
    await mongoose.connect(cloudUrl, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
    db = mongoose.connection; // Assign the mongoose connection instance
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
