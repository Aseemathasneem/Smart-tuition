
import express from 'express';
import { 
  adminSignUp, 
  adminResendOtp, 
  adminVerifyOtp, 
  adminSignIn, 
  adminGoogleSignIn 
} from '../controllers/admin.controller.js';

const router = express.Router();

// Routes for admin authentication
router.post('/signup', adminSignUp);
router.post('/resend-otp', adminResendOtp);
router.post('/verify-otp', adminVerifyOtp);
router.post('/signin', adminSignIn);
router.post('/google-signin', adminGoogleSignIn);

// Add any other admin-specific routes here

export default router;
