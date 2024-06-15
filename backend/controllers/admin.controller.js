import Admin from '../models/admin.model.js';
import {
  signup,
  resendOtp,
  verifyOtp,
  signin,
  googleSignIn,
} from '../utils/authUtils.js';

export const adminSignUp = (req, res, next) => signup(Admin, req, res, next);
export const adminResendOtp = (req, res, next) => resendOtp(Admin, req, res, next);
export const adminVerifyOtp = (req, res, next) => verifyOtp(Admin, req, res, next);
export const adminSignIn = (req, res, next) => signin(Admin, req, res, next);
export const adminGoogleSignIn = (req, res, next) => googleSignIn(Admin, req, res, next);
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

