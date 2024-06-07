import Student from '../models/student.model.js';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import crypto from 'crypto'
import { errorHandler } from '../utils/error.js'
import jwt from 'jsonwebtoken';
import { log } from 'console';

const OTP_EXPIRATION_TIME = 10 * 60 * 1000; // 10 minutes in milliseconds
const MAX_RESEND_ATTEMPTS = 2;
const RESEND_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds
// Function to generate OTP
function generateOTP() {
  return crypto.randomBytes(3).toString('hex'); // 6-character OTP
}

// Function to send OTP email
async function sendOTPEmail(student, otp) {
 
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
      port: 587,
      secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: student.email,
    subject: 'OTP Verification',
    text: `Your OTP is ${otp}`,
  });
}

// Signup function
export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (
    !name ||
    !email ||
    !password ||
    name === '' ||
    email === '' ||
    password === ''
  ) {
    return next(errorHandler(400, 'All fields are required'));
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const otp = generateOTP();
  const otpExpires = new Date(Date.now()+ OTP_EXPIRATION_TIME ); 

  const newStudent = new Student({
    name,
    email,
    password: hashedPassword,
    otp,
    otp_expires: otpExpires,
  });

  try {
    await newStudent.save();
    await sendOTPEmail(newStudent, otp);
    res.json('Signup successful. OTP sent to your email.');
  } catch (error) {
     next(error)
  }
}
export const resendOtp = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(errorHandler(400, 'Email is required'));
  }

  try {
    const student = await Student.findOne({ email });

    if (!student) {
      return next(errorHandler(404, 'Student not found'));
    }

    const now = Date.now();
    if (student.otp_resend_count >= MAX_RESEND_ATTEMPTS && (now - student.otp_last_resend.getTime()) < RESEND_TIMEOUT) {
      return res.status(429).json({ success: false, message: 'You have reached the maximum number of OTP resend attempts. Please try again later.' });
    }

    // Generate a new OTP
    const otp = generateOTP();
    

    student.otp = otp ;
    student.otp_expires = new Date(Date.now() + OTP_EXPIRATION_TIME); // Consistent OTP expiration time
    student.otp_resend_count += 1;
    student.otp_last_resend = new Date();
    await student.save();

    // Send the OTP via email
    await sendOTPEmail(student, otp);

    res.json({ success: true, message: 'OTP has been resent successfully' });
  } catch (error) {
    console.error('Error during OTP resend:', error);
    next(error);
  }
};
export const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(errorHandler(400, 'Email and OTP are required'));
  }

  try {
    const student = await Student.findOne({ email });

    if (!student) {
      return next(errorHandler(404, 'Student not found'));
    }

    if (student.is_verified) {
      return res.status(400).json({ success: false, message: 'Account already verified' });
    }

    

    const isOtpValid = await bcrypt.compare(otp, student.otp); 

    if (!isOtpValid) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    if (student.otp_expires < Date.now()) {
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }

    student.is_verified = true;
    student.otp = undefined; // Clear OTP after verification
    student.otp_expires = undefined; // Clear OTP expiry after verification
    student.otp_resend_count = 0; // Reset resend count after successful verification
    student.otp_last_resend = undefined; // Clear last resend time

    await student.save();

    res.json({ success: true, message: 'Account verified successfully' });

  } catch (error) {
    console.error('Error during OTP verification:', error); // Log error for debugging
    next(error);
  }
};
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === '' || password === '') {
    next(errorHandler(400, 'All fields are required'));
  }

  try {
    const validUser = await Student.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, 'User not found'));
    }
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, 'Invalid password'));
    }
    const token = jwt.sign(
      { id: validUser._id },
      process.env.JWT_SECRET
    );

    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};
export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await Student.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new Student({
        name:
          name.toLowerCase().split(' ').join('') +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id},
        process.env.JWT_SECRET
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
