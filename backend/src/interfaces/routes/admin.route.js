
import express from 'express';
import { 
  signout,
  adminSignUp, 
  adminResendOtp, 
  adminVerifyOtp, 
  adminSignIn, 
  adminGoogleSignIn, 
  getAdminData,
  fetchStudents,
  fetchTutors,
  blockStudent,
  unblockStudent,
  blockTutor,
  unblockTutor,
  getApprovalRequests,
  approveRequest,
  rejectRequest,
  getAdminRevenue,
  getTotalStudents,
  getTotalTutors,
  getAdminPaymentDetails,
 
} from '../controllers/admin.controller.js';
import { verifyToken } from '../../middleware/authMiddleware.js';
import { addSubject, deleteSubject, getSubjects, updateSubject } from '../controllers/subject.controller.js';

const router = express.Router();

// Routes for admin authentication
router.post('/signup', adminSignUp);
router.post('/resend-otp', adminResendOtp);
router.post('/verify-otp', adminVerifyOtp);
router.post('/signin', adminSignIn);
router.post('/google-signin', adminGoogleSignIn);
router.post('/signout', signout);

router.get('/user-info', verifyToken('admin'), getAdminData);
router.get('/students',verifyToken('admin'), fetchStudents);
router.get('/tutors',verifyToken('admin'), fetchTutors);
router.post('/students/block',verifyToken('admin'), blockStudent);
router.post('/students/unblock',verifyToken('admin'), unblockStudent);
router.post('/tutors/block',verifyToken('admin'), blockTutor);
router.post('/tutors/unblock',verifyToken('admin'), unblockTutor);
router.get('/approvalRequests', verifyToken('admin'),getApprovalRequests);
router.post('/approvalRequests/approve',verifyToken('admin'), approveRequest);
router.post('/approvalRequests/reject',verifyToken('admin'), rejectRequest);

router.get('/subjects', getSubjects);
router.post('/add-subject',verifyToken('admin'), addSubject);
router.put('/update-subject/:id', verifyToken('admin'),updateSubject);
router.delete('/delete-subject/:id',verifyToken('admin'),deleteSubject);
router.get('/admin-revenue',verifyToken('admin'), getAdminRevenue);
router.get('/total-students',verifyToken('admin'), getTotalStudents);
router.get('/total-tutors',verifyToken('admin'), getTotalTutors);
router.get('/payment-details',verifyToken('admin'),getAdminPaymentDetails );





export default router;
