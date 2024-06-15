// utils/authUtils.js
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

const OTP_EXPIRATION_TIME = 10 * 60 * 1000; // 10 minutes in milliseconds
const MAX_RESEND_ATTEMPTS = 2;
const RESEND_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds;

// Function to generate OTP
function generateOTP() {
  return crypto.randomBytes(3).toString('hex'); // 6-character OTP
}

// Function to send OTP email
async function sendOTPEmail(user, otp) {
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
    to: user.email,
    subject: 'OTP Verification',
    text: `Your OTP is ${otp}`,
  });
}

// Signup function
export async function signup(Model, req, res, next) {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword || name === '' || email === '' || password === '' || confirmPassword === '') {
    return next(errorHandler(400, 'All fields are required'));
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return next(errorHandler(400, 'Passwords do not match'));
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + OTP_EXPIRATION_TIME);

  const newUser = new Model({
    name,
    email,
    password: hashedPassword,
    otp,
    otp_expires: otpExpires,
  });

  try {
    await newUser.save();
    await sendOTPEmail(newUser, otp);
    res.json('Signup successful. OTP sent to your email.');
  } catch (error) {
    next(error);
  }
}

export async function resendOtp(Model, req, res, next) {
  const { email } = req.body;

  if (!email) {
    return next(errorHandler(400, 'Email is required'));
  }

  try {
    const user = await Model.findOne({ email });

    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    const now = Date.now();
    if (user.otp_resend_count >= MAX_RESEND_ATTEMPTS && (now - user.otp_last_resend.getTime()) < RESEND_TIMEOUT) {
      return res.status(429).json({ success: false, message: 'You have reached the maximum number of OTP resend attempts. Please try again later.' });
    }

    // Generate a new OTP
    const otp = generateOTP();

    user.otp = otp;
    user.otp_expires = new Date(Date.now() + OTP_EXPIRATION_TIME); // Consistent OTP expiration time
    user.otp_resend_count += 1;
    user.otp_last_resend = new Date();
    await user.save();

    // Send the OTP via email
    await sendOTPEmail(user, otp);

    res.json({ success: true, message: 'OTP has been resent successfully' });
  } catch (error) {
    next(error);
  }
}

export async function verifyOtp(Model, req, res, next) {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(errorHandler(400, 'Email and OTP are required'));
  }

  try {
    const user = await Model.findOne({ email });

    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    if (user.is_verified) {
      return res.status(400).json({ success: false, message: 'Account already verified' });
    }

    const isOtpValid = await bcrypt.compare(otp, user.otp);  

    if (!isOtpValid) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    if (user.otp_expires < Date.now()) {
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }

    user.is_verified = true;
    user.otp = undefined; // Clear OTP after verification
    user.otp_expires = undefined; // Clear OTP expiry after verification
    user.otp_resend_count = 0; // Reset resend count after successful verification
    user.otp_last_resend = undefined; // Clear last resend time

    await user.save();

    res.json({ success: true, message: 'Account verified successfully' });
  } catch (error) {
    next(error);
  }
}

export async function signin(Model, req, res, next) {
  const { email, password } = req.body;

  if (!email || !password || email === '' || password === '') {
    return next(errorHandler(400, 'All fields are required'));
  }

  try {
    const user = await Model.findOne({ email });
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return next(errorHandler(400, 'Invalid password'));
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET
    );

    const { password: pass, ...rest } = user._doc;

    res
      .status(200)
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .json({
        ...rest,
        token // Include the token in the response body
      });
  } catch (error) {
    next(error);
  }
}

export async function googleSignIn(Model, req, res, next) {
  const { email, name, googlePhotoUrl } = req.body;

  try {
    const user = await Model.findOne({ email });

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
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const newUser = new Model({
        name: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
        is_verified: true,
      });

      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id },
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
}
