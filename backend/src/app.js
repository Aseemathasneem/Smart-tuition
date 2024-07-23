// src/app.js
import express from 'express';
import cookieParser from 'cookie-parser';

import studentRoutes from './interfaces/routes/student.route.js';
import adminRoutes from './interfaces/routes/admin.route.js';
import tutorRoutes from './interfaces/routes/tutor.route.js';
import paymentRoutes from './interfaces/routes/payment.route.js'
import errorMiddleware from './middleware/errorMiddleware.js';
import path from 'path'; 
import { fileURLToPath } from 'url';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Use the raw body parser specifically for the Stripe webhook endpoint
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tutor', tutorRoutes);
app.use('/api/payment', paymentRoutes);


app.use(errorMiddleware)

export default app;
