import Student from '../../domain/student.model.js';
import Tutor from '../../domain/tutor.model.js';
import {
  signup,
  resendOtp,
  verifyOtp,
  signin,
  googleSignIn,
  getUserData
} from '../../utils/authUtils.js';

export const studentSignUp = (req, res, next) => signup(Student, req, res, next);
export const studentResendOtp = (req, res, next) => resendOtp(Student, req, res, next);
export const studentVerifyOtp = (req, res, next) => verifyOtp(Student, req, res, next);
export const studentSignIn = (req, res, next) => signin(Student, req, res, next);
export const studentGoogleSignIn = (req, res, next) => googleSignIn(Student, req, res, next);
export const getStudentData = (req, res, next) => { getUserData(Student, req, res, next);};
export const signout = (req, res, next) => {
  try {
    res
      .clearCookie('student_accessToken')
      .status(200)
      .json('User has been signed out');
  } catch (error) {
    next(error);
  }
};

export const getApprovedTutors = async (req, res, next) => {
  try {
    const tutors = await Tutor.find({ status: 'approved' });
    res.status(200).json(tutors);
  } catch (error) {
    next(errorHandler(500, 'Server Error'));
  }
};

export const getTutorDetails = async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.tutorId);

    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    res.json(tutor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const bookSlot = async (req, res) => {
  const { tutorId, studentId, date, startTime, endTime } = req.body;

  try {
    const tutor = await Tutor.findById(tutorId);
    const student = await Student.findById(studentId);

    if (!tutor || !student) {
      return res.status(404).json({ message: 'Tutor or student not found' });
    }
    
    // Find the slot to be booked
    const slotIndex = tutor.availability.findIndex(
      slot =>
        slot.date.getTime() === new Date(date).getTime() && slot.startTime === startTime && slot.endTime === endTime
    );

    if (slotIndex === -1) {
      return res.status(400).json({ message: 'Slot not available' });
    }
    
    const bookedSlotFromAvailability = tutor.availability.splice(slotIndex, 1)[0];

    // Create a new object for the booked slot including studentId and status
    const bookedSlot = {
      studentId: studentId,
      date: bookedSlotFromAvailability.date,
      startTime: bookedSlotFromAvailability.startTime,
      endTime: bookedSlotFromAvailability.endTime,
      status: 'pending', // Set status to pending
    };

    // Move the booked slot to the booked array
    tutor.booked.push(bookedSlot);

    // Add the booked slot to the student's bookedSlots with status pending
    student.bookedSlots.push({
      tutorId,
      date,
      startTime,
      endTime,
      status: 'pending', 
    });

    // Save both documents
    await tutor.save();
    await student.save();

    res.status(200).json({ message: 'Slot booked successfully with pending status' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
