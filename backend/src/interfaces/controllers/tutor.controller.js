import Tutor from '../../domain/tutor.model.js';
import ApprovalRequest from '../../domain/approvalRequest.model.js';
import {
  signup,
  resendOtp,
  verifyOtp,
  signin,
  googleSignIn,
  getUserData
} from '../../utils/authUtils.js';


export const tutorSignUp = (req, res, next) => signup(Tutor, req, res, next);
export const tutorResendOtp = (req, res, next) => resendOtp(Tutor, req, res, next);
export const tutorVerifyOtp = (req, res, next) => verifyOtp(Tutor, req, res, next);
export const tutorSignIn = (req, res, next) => signin(Tutor, req, res, next);
export const tutorGoogleSignIn = (req, res, next) => googleSignIn(Tutor, req, res, next);
export const getTutorData = (req, res, next) => { getUserData(Tutor, req, res, next);};
export const signout = (req, res, next) => {
  try {
    res
      .clearCookie('tutor_accessToken')
      .status(200)
      .json('User has been signed out');
  } catch (error) {
    next(error);
  }
};

export const tutorProfileUpdate = async (req, res, next) => {
  try {
    
    const tutorId = req.user.id; 
    const { qualification, classes, subjects, hourlyRate, availableTime, availableDays, bio } = req.body;
     
    const certificate = req.file ? req.file.path : null;
    

    // Update tutor profile details
    const updatedTutor = await Tutor.findByIdAndUpdate(
      tutorId,
      {
        qualification,
        classes,
        subjects,
        hourlyRate,
        availableTime,
        availableDays,
        bio,
        certificate: certificate || undefined, // Directly use certificate path
      },
      { new: true }
    );

    // Create a new approval request
    const approvalRequest = new ApprovalRequest({
      tutor: tutorId,
    });
    await approvalRequest.save();

    // Send response back to client
    res.status(200).json({
      success: true,
      message: 'Profile updated and approval request sent.',
      tutor: updatedTutor,
    });
  } catch (error) {
    next(error);
  }
};

export const getTutorProfile = async (req, res) => {
  try {
    const tutorId = req.user.id;
    
    const tutor = await Tutor.findOne({ _id: tutorId });
    
    if (!tutor) {
      return res.status(404).json({ success: false, message: 'Tutor profile not found' });
    }

    

    res.json(tutor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const saveAvailability = async (req, res) => {
  try {
    const { tutorId, availability } = req.body;

    if (!tutorId || !availability) {
      return res.status(400).json({ success: false, message: 'Tutor ID and availability are required' });
    }

    const tutor = await Tutor.findById(tutorId);

    if (!tutor) {
      return res.status(404).json({ success: false, message: 'Tutor not found' });
    }

    tutor.availability = availability;

    await tutor.save();

    res.status(200).json({ success: true, message: 'Availability saved successfully', tutor });
  } catch (error) {
    console.error('Error saving availability:', error);
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};
export const fetchBookedSlots= async (req, res) => {
  try {
    const { tutorId } = req.params;
     
    const tutor = await Tutor.findById(tutorId).populate('booked.studentId', 'name'); // Populate student name
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }
    // Filter booked slots to include only those with status 'completed'
    const completedSlots = tutor.booked.filter(slot => slot.status === 'completed');

    res.json(completedSlots);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
   
};
