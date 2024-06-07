import express from 'express';
import { google, resendOtp, signin, signup, verifyOtp } from '../controllers/auth.controller.js';


const router = express.Router();

router.post('/signup',signup)
router.post('/verify-otp',verifyOtp)
router.post('/resend-otp', resendOtp);
router.post('/signin',signin)
router.post('/google', google)

export default router;