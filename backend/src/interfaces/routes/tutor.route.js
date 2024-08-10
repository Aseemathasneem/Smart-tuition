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
  fetchBookedSlots,
  getTutorNotifications,
  getAvailableSlots,
  deleteSlot,
  updateSlot,
  updateSession,
  fetchStudents,
  createAssignment,
  getSubmittedAssignments,
  getTutorRevenue

} from '../controllers/tutor.controller.js';
import { verifyToken} from '../../middleware/authMiddleware.js';
import upload from '../../middleware/uploadCertificate.js';
import { getSubjects } from '../controllers/subject.controller.js';

import { cancelSession } from '../controllers/session.controller.js';

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
router.get('/booked-slots/:tutorId', verifyToken('tutor'),fetchBookedSlots)
router.get('/available-slots/:tutorId',verifyToken('tutor'), getAvailableSlots);
router.delete('/delete-slot/:slotId',verifyToken('tutor'), deleteSlot);
router.put('/update-slot/:slotId',verifyToken('tutor'), updateSlot);
router.put('/update-session/:sessionId',verifyToken('tutor'), updateSession);

router.get('/students', verifyToken('tutor'), fetchStudents);
router.post('/create-assignment',verifyToken('tutor'), createAssignment);
router.get('/submitted-answers/:tutorId',verifyToken('tutor'), getSubmittedAssignments);

router.get('/notifications/:userId',verifyToken('tutor'),getTutorNotifications)
router.put('/cancel/:sessionId',verifyToken('tutor'), cancelSession);

router.get('/tutor-revenue/:tutorId',verifyToken('tutor'), getTutorRevenue);





export default router;
