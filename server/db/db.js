import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    // THIS IS THE DIAGNOSTIC LINE
    console.log("--- Attempting to connect to MongoDB with this URI: ---");
    console.log(process.env.MONGO_URI);
    console.log("------------------------------------------------------");

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;