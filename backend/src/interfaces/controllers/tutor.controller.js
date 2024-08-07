import Tutor from '../../domain/tutor.model.js';
import  Slot  from '../../domain/slot.model.js'
import Session from '../../domain/session.model.js'
import Notification from '../../domain/notification.model.js';
import ApprovalRequest from '../../domain/approvalRequest.model.js';
import { errorHandler } from '../../utils/error.js';
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

    const newSlots = [];

    availability.forEach(slot => {
      const { date, startTime, endTime } = slot;
      const [startHour] = startTime.split(':').map(Number);
      const [endHour] = endTime.split(':').map(Number);

      for (let hour = startHour; hour < endHour; hour++) {
        newSlots.push({
          tutorId,
          date,
          startTime: `${hour}:00`,
          endTime: `${hour + 1}:00`,
          status: 'available',
        });
      }
    });

    // Save new slots to the database
    const savedSlots = await Slot.insertMany(newSlots);

    res.status(200).json({ success: true, message: 'Availability saved successfully', slots: savedSlots });
  } catch (error) {
    console.error('Error saving availability:', error);
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};
export const fetchBookedSlots = async (req, res) => {
  try {
    const { tutorId } = req.params;

    // Fetch confirmed sessions for the tutor and populate slot details
    const confirmedSessions = await Session.find({ 
      tutorId: tutorId, 
      status: 'confirmed' 
    }).populate('studentId', 'name')
      .populate('slotId', 'date startTime endTime'); // populate slot details

    res.status(200).json({ sessions: confirmedSessions });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAvailableSlots = async (req, res) => {
  try {
    const { tutorId } = req.params;
   
    
    const availableSlots = await Slot.find({ tutorId, status: 'available' });
    res.status(200).json(availableSlots);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


 export const deleteSlot = async (req, res) => {
  try {
    const { slotId } = req.params;

    console.log('slot id',slotId)
    const deletedSlot = await Slot.findByIdAndDelete(slotId);

    if (!deletedSlot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    res.status(200).json({ message: 'Slot deleted successfully', deletedSlot });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateSlot = async (req, res, next) => {
  try {
    const { slotId } = req.params;
    
    const { date, startTime, endTime, tutorId } = req.body;

    // Normalize the date to only compare the date part
    const updateDate = new Date(date);
    const normalizedUpdateDate = new Date(updateDate.getFullYear(), updateDate.getMonth(), updateDate.getDate());

    // Find conflicting slots
    const conflictingSlot = await Slot.findOne({
      _id: { $ne: slotId },
      tutorId,
      status: 'booked',
      $expr: {
        $and: [
          { $eq: [{ $year: "$date" }, updateDate.getFullYear()] },
          { $eq: [{ $month: "$date" }, updateDate.getMonth() + 1] },
          { $eq: [{ $dayOfMonth: "$date" }, updateDate.getDate()] }
        ]
      },
      $or: [
        {
          $and: [
            { startTime: { $lt: endTime } },
            { endTime: { $gt: startTime } }
          ]
        }
      ]
    });

    if (conflictingSlot) {
      return next(errorHandler(403, 'Conflicting booked slot found for the same date and time'));
    }

    // Proceed with updating the slot if no conflicts are found
    const updatedSlot = await Slot.findByIdAndUpdate(slotId, req.body, { new: true });

    if (!updatedSlot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    res.status(200).json(updatedSlot);
  } catch (error) {
    next(error);
  }
};

export const updateSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    console.log(sessionId)
    const { date, startTime, endTime, tutorId } = req.body;

    // Normalize the date to only compare the date part
    const updateDate = new Date(date);
    const normalizedUpdateDate = new Date(updateDate.getFullYear(), updateDate.getMonth(), updateDate.getDate());

    // Find the session and get the associated slotId
    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const slotId = session.slotId; // Get the slotId from the session

    // Find conflicting slots
    const conflictingSlot = await Slot.findOne({
      _id: { $ne: slotId },
      tutorId,
      status: 'booked',
      $expr: {
        $and: [
          { $eq: [{ $year: "$date" }, updateDate.getFullYear()] },
          { $eq: [{ $month: "$date" }, updateDate.getMonth() + 1] },
          { $eq: [{ $dayOfMonth: "$date" }, updateDate.getDate()] }
        ]
      },
      $or: [
        {
          $and: [
            { startTime: { $lt: endTime } },
            { endTime: { $gt: startTime } }
          ]
        }
      ]
    });

    if (conflictingSlot) {
      return next(errorHandler(403, 'Conflicting booked slot found for the same date and time'));
    }

    // Proceed with updating the slot if no conflicts are found
    const updatedSlot = await Slot.findByIdAndUpdate(slotId, { date, startTime, endTime }, { new: true });

    if (!updatedSlot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    res.status(200).json(updatedSlot);
  } catch (error) {
    next(error);
  }
};
export const getTutorNotifications = async (req, res, next) => {
  try {
    const { userId } = req.params; 
    const notifications = await Notification.find({
      userId,
      userType: 'tutor',
    }).sort({ createdAt: -1 });
    res.status(200).json({ notifications });
  } catch (error) {
    next(error);
  }
};
