// routes/tutor.route.js
import express from 'express';
import { 
  tutorSignUp, 
  tutorResendOtp, 
  tutorVerifyOtp, 
  tutorSignIn, 
  tutorGoogleSignIn ,
  signout,
  getTutorData,
  tutorProfileUpdate,
  getTutorProfile,
  saveAvailability,
  fetchBookedSlots

} from '../controllers/tutor.controller.js';
import { verifyToken} from '../../middleware/authMiddleware.js';
import upload from '../../middleware/uploadCertificate.js';
import { getSubjects } from '../controllers/subject.controller.js';

const router = express.Router();


// Routes for tutor authentication
router.post('/signup', tutorSignUp);
router.post('/resend-otp', tutorResendOtp);
router.post('/verify-otp', tutorVerifyOtp);
router.post('/signin', tutorSignIn);
router.post('/google-signin', tutorGoogleSignIn);
router.post('/signout', signout);

router.get('/user-info', verifyToken('tutor'), getTutorData);

router.post('/profile-update',verifyToken('tutor'),upload,tutorProfileUpdate)
router.get('/profile',verifyToken('tutor'),getTutorProfile)
router.post('/save-availability',verifyToken('tutor'),saveAvailability)
router.get('/subjects',verifyToken('tutor'),getSubjects)
router.get('/booked-slots/:tutorId',fetchBookedSlots)

export default router;
