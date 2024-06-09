import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import Student from '../models/student.model.js';

export const test = (req, res) => {
  res.json({ message: 'API is working!' });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this user'));
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, 'Password must be at least 6 characters'));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.name) {
    if ( req.body.name.length > 20) {
      return next(
        errorHandler(400, 'name must be greater than 20 characters')
      );
    }
    
  }
  try {
    const updatedUser = await Student.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req,res,next)=>{
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this user'));
  }
  try {
    await Student.findByIdAndDelete(req.params.userId)
    res.status(200).json('User has been deleted')
  } catch (error) {
    next(error)
  }

}


