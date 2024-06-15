import Student from '../models/student.model.js';
import {
  signup,
  resendOtp,
  verifyOtp,
  signin,
  googleSignIn,
} from '../utils/authUtils.js';

export const studentSignUp = (req, res, next) => signup(Student, req, res, next);
export const studentResendOtp = (req, res, next) => resendOtp(Student, req, res, next);
export const studentVerifyOtp = (req, res, next) => verifyOtp(Student, req, res, next);
export const studentSignIn = (req, res, next) => signin(Student, req, res, next);
export const studentGoogleSignIn = (req, res, next) => googleSignIn(Student, req, res, next);
export const signout = (req, res, next) => {
  try {
    res
      .clearCookie('access_token')
      .status(200)
      .json('User has been signed out');
  } catch (error) {
    next(error);
  }
};
