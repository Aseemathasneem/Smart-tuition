// routes/tutor.route.js
import express from 'express';
import { 
  tutorSignUp, 
  tutorResendOtp, 
  tutorVerifyOtp, 
  tutorSignIn, 
  tutorGoogleSignIn ,
  signout
} from '../controllers/tutor.controller.js';

const router = express.Router();

// Routes for tutor authentication
router.post('/signup', tutorSignUp);
router.post('/resend-otp', tutorResendOtp);
router.post('/verify-otp', tutorVerifyOtp);
router.post('/signin', tutorSignIn);
router.post('/google-signin', tutorGoogleSignIn);
router.post('/signout', signout);

// Add any other tutor-specific routes here

export default router;
