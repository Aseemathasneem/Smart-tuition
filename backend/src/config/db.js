// config/db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
console.log(process.env.MONGODB_URI)

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB is connected');
    
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
