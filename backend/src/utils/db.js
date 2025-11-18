import mongoose from 'mongoose';
import config from '../config/config.js';  // Your config that holds Mongo URI

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoURI);
    console.log(`MongoDB connected to: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;
