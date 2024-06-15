import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';  // Import cookie-parser
import studentRoutes from './routes/student.route.js';
import adminRoutes from './routes/admin.route.js';
import tutorRoutes from './routes/tutor.route.js';
import { errorHandler } from './utils/error.js'; 

dotenv.config();

mongoose.connect(process.env.MONGO)
  .then(() => {
    console.log('MongoDb is connected');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

const app = express();

app.use(express.json());
app.use(cookieParser());  // Use cookie-parser

app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tutor', tutorRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000!!');
});
