// src/app.js
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import studentRoutes from './interfaces/routes/student.route.js';
import adminRoutes from './interfaces/routes/admin.route.js';
import tutorRoutes from './interfaces/routes/tutor.route.js';
import paymentRoutes from './interfaces/routes/payment.route.js'
import sessionRoutes from './interfaces/routes/session.route.js'
import errorMiddleware from './middleware/errorMiddleware.js';
import path from 'path'; 
import { fileURLToPath } from 'url';
import { initializeSocket,io } from './services/socket.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create HTTP server
const server = createServer(app);

// Initialize socket.io
initializeSocket(server);

const corsOptions = {
  origin: ['http://localhost:5173'], // Allow your production and development URLs
  credentials: true, // Allow cookies and auth headers
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
};

app.use(cors(corsOptions)); // Apply CORS middleware


// Use the raw body parser specifically for the Stripe webhook endpoint
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf }}));

app.use((req, res, next) => {
  req.io = io; // Attach io to req
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tutor', tutorRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/sessions', sessionRoutes);




app.use(errorMiddleware)

export default server;
