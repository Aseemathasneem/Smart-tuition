import express from 'express'

import { signout,
    studentSignUp, 
  studentResendOtp, 
  studentVerifyOtp, 
  studentSignIn, 
  studentGoogleSignIn,
  getStudentData,
  getApprovedTutors,
  getTutorDetails,
  bookSlot
  } from '../controllers/student.controller.js'

  import { verifyToken } from '../../middleware/authMiddleware.js';



const router = express.Router()
// Routes for student authentication
router.post('/signup', studentSignUp);
router.post('/resend-otp', studentResendOtp);
router.post('/verify-otp', studentVerifyOtp);
router.post('/signin', studentSignIn);
router.post('/google-signin', studentGoogleSignIn);
router.post('/signout', signout);

router.get('/user-info', verifyToken('student'), getStudentData);
router.get('/approved-tutors',verifyToken('student'),  getApprovedTutors);
router.get('/tutors/:tutorId',verifyToken('student'), getTutorDetails);
router.post('/book_slot',verifyToken('student'), bookSlot);




export default router