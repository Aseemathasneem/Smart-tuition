import Tutor from '../models/tutor.model.js';
import {
  signup,
  resendOtp,
  verifyOtp,
  signin,
  googleSignIn,
  
} from '../utils/authUtils.js';

export const tutorSignUp = (req, res, next) => signup(Tutor, req, res, next);
export const tutorResendOtp = (req, res, next) => resendOtp(Tutor, req, res, next);
export const tutorVerifyOtp = (req, res, next) => verifyOtp(Tutor, req, res, next);
export const tutorSignIn = (req, res, next) => signin(Tutor, req, res, next);
export const tutorGoogleSignIn = (req, res, next) => googleSignIn(Tutor, req, res, next);
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
