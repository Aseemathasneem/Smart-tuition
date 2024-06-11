import express from 'express'

import { signout,
    studentSignUp, 
  studentResendOtp, 
  studentVerifyOtp, 
  studentSignIn, 
  studentGoogleSignIn
  } from '../controllers/student.controller.js'


const router = express.Router()
// Routes for student authentication
router.post('/signup', studentSignUp);
router.post('/resend-otp', studentResendOtp);
router.post('/verify-otp', studentVerifyOtp);
router.post('/signin', studentSignIn);
router.post('/google-signin', studentGoogleSignIn);

router.post('/signout', signout);
import { test,  updateUser } from '../controllers/student.controller.js'
import { verifyToken } from '../utils/verifyUser.js'

const router = express.Router()
router.get('/test',test)
router.put('/update:userId',verifyToken, updateUser)


export default router