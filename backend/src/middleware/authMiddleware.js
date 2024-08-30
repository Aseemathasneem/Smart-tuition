import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';
import Student from '../domain/student.model.js'
import Tutor from '../domain/tutor.model.js'

export const verifyToken = (role) => async (req, res, next) => {
  const cookieName = `${role}_accessToken`;
  const token = req.cookies[cookieName];

  if (!token) {
    return next(errorHandler(401, 'Access denied. No token provided.'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // If the role is admin, skip user model check
    if (role === 'admin') {
      return next();
    }

    // Determine the model to use based on the role
    const userModel = role === 'student' ? Student : Tutor;

    // Check if the user is blocked
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return next(errorHandler(404, 'User not found.'));
    }
    
    if (user.isBlocked) {
      res.clearCookie(cookieName);
      return res.status(403).json({ message: 'Your account is blocked. Please contact support.', isBlocked: true });
    }

    if (req.user.role !== role) {
      return next(errorHandler(403, 'Access denied. Role mismatch.'));
    }

    next();
  } catch (ex) {
    next(errorHandler(400, 'Invalid token.'));
  }
};