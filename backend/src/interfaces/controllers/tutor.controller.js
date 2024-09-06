
import mongoose from 'mongoose';
import Tutor from '../../domain/tutor.model.js';
import  Slot  from '../../domain/slot.model.js'
import Session from '../../domain/session.model.js'
import Notification from '../../domain/notification.model.js';
import ApprovalRequest from '../../domain/approvalRequest.model.js';
import Student from '../../domain/student.model.js'
import Assignment from '../../domain/assignment.model.js'
import Submission from '../../domain/submission.model.js'
import Payment from '../../domain/payment.model.js'
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
    const { qualification,experience, classes, subjects, syllabus, hourlyRate, bio, profilePicture } = req.body;
  console.log(req.body)
    // Find the existing tutor profile
    const tutor = await Tutor.findById(tutorId);

    // Use the new profile picture URL from the frontend or keep the existing one
    const updatedProfilePicture = profilePicture || tutor.profilePicture;

    // Update tutor profile details
    const updatedTutor = await Tutor.findByIdAndUpdate(
      tutorId,
      {
        qualification,
        experience,
        classes,
        subjects,
        hourlyRate,
        syllabus,
        bio,
        certificate: req.file ? req.file.path : tutor.certificate, // Assuming certificate is optional
        profilePicture: updatedProfilePicture,  // Update with Firebase URL
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

    for (const slot of availability) {
      const { start, end } = slot;
      const startDate = new Date(start);
      const endDate = new Date(end);

      // Format the start and end times with both hours and minutes
      const startTime = startDate.toTimeString().split(' ')[0].substring(0, 5); // HH:MM format
      const endTime = endDate.toTimeString().split(' ')[0].substring(0, 5);
      const date = startDate.toISOString().split('T')[0]; // Extract the date part

      // Check for conflicting booked slots
      const conflictingSlot = await Slot.findOne({
        tutorId,
        status: 'booked',
        date,
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
        return res.status(403).json({
          success: false,
          message: `Conflicting booked slot found on ${date} from ${conflictingSlot.startTime} to ${conflictingSlot.endTime}`
        });
      }

      newSlots.push({
        tutorId,
        date,
        startTime,
        endTime,
        status: 'available',
      });
    }

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
export const fetchStudents = async (req, res, next) => {
  try {
    const students = await Student.find({});
   
    res.status(200).json(students);
  } catch (error) {
    next(error);
  }

};

export const createAssignment = async (req, res) => {
  try {
    const assignment = new Assignment(req.body);
    await assignment.save();
    res.status(201).json(assignment);
    console.log('assnmnt saved successfully');
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getSubmittedAssignments = async (req, res) => {
  try {
    const { tutorId } = req.params;

    // Find completed assignments for the tutor
    const completedAssignments = await Assignment.find({ tutorId, status: 'completed' });

    // Extract assignment IDs
    const assignmentIds = completedAssignments.map(assignment => assignment._id);

    // Find submissions for these assignments
    const submissions = await Submission.find({ assignmentId: { $in: assignmentIds } }).populate('studentId').populate('assignmentId');

    // Format the response to include assignment details along with the submissions
    const response = completedAssignments.map(assignment => ({
      ...assignment.toObject(),
      submissions: submissions.filter(submission => submission.assignmentId.equals(assignment._id))
    }));
   
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch submitted assignments', error });
  }
};





export const gradeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { grade, remarks } = req.body;  // Receive remarks from request

    // Find the submission by ID
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Update the submission with grade, remarks, and status
    submission.grade = grade;
    submission.remarks = remarks; 
    submission.status = 'verified';
    await submission.save();

    // Update the related assignment with the tutor's assigned grade and status
    const assignment = await Assignment.findById(submission.assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    assignment.tutorAssignedGrade = grade;
    assignment.remarks = remarks; 
    assignment.status = 'verified';  // Update the assignment status to verified
    await assignment.save();

    return res.status(200).json({ message: 'Submission graded successfully', submission });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};


export const getDistinctStudentsCount = async (req, res) => {
  const { tutorId } = req.params;
   
  try {
    
    const result = await Session.aggregate([
      {
        $match: {
          tutorId: new mongoose.Types.ObjectId(tutorId),
          studentAttended: true, // Filter only the sessions where the student attended
          status: 'completed' // Optional: Filter only completed sessions
        }
      },
      {
        $group: {
          _id: '$studentId', // Group by studentId
        }
      },
      {
        $count: 'distinctStudents' // Count the number of distinct studentIds
      }
    ]);

    const distinctStudentsCount = result.length > 0 ? result[0].distinctStudents : 0;
    
    
    res.status(200).json({ count: distinctStudentsCount });
  } catch (error) {
    console.error('Error fetching distinct students count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTutorRevenue = async (req, res) => {
  
  const { tutorId } = req.params;
  
  try {
    // Convert tutorId to ObjectId if necessary
    const tutorObjectId =new mongoose.Types.ObjectId(tutorId);
    // Fetch all payments related to the specific tutor
    const payments = await Payment.aggregate([
      { $match: { tutorId: tutorObjectId } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$tutoringFee' } 
        }
      }
    ]);
   

    // If no payments found, set totalRevenue to 0
    const totalRevenue = payments.length > 0 ? payments[0].totalRevenue : 0;

    
    res.json({ totalRevenue });
  } catch (error) {
    
    res.status(500).json({ error: 'Failed to fetch tutor revenue', details: error.message });
  }
};

export const getTotalTutoringHours = async (req, res) => {
  const { tutorId } = req.params;

  try {
    // Count the total number of sessions that are marked as completed for the tutor
    const totalSessions = await Session.countDocuments({ 
      tutorId, 
      status: 'completed',
      tutorAttended: true 
    });

    // Assuming 1 session = 1 hour, totalSessions is the total number of hours
    const totalTutoringHours = totalSessions;
  
    
    
    res.status(200).json({ totalTutoringHours });
  } catch (error) {
    console.error("Error calculating total tutoring hours:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const getTutorPaymentDetails = async (req, res) => {
  const { tutorId } = req.params;
  
  
  try {
    // Fetch payments related to the tutor
    const payments = await Payment.find({ tutorId })
      .populate({
        path: 'sessionId',
        populate: {
          path: 'slotId', // Populate the slot details
          model: 'Slot',
        },
      })
      .populate('studentId', 'name'); // Populate the student name

    console.log("Payments fetched:", payments); // Log the fetched payments

    // Check if payments were found
    if (!payments || payments.length === 0) {
      console.log("No payments found for this tutor.");
      return res.status(404).json({ message: 'No payments found' });
    }

    // Map through the payments and extract required details
    const paymentDetails = payments.map(payment => {
      

      // Ensure session and slot are populated
      if (payment.sessionId && payment.sessionId.slotId) {
        return {
          studentName: payment.studentId.name,
          sessionDate: payment.sessionId.slotId.date, // Assuming the slot model has a `date` field
          startTime: payment.sessionId.slotId.startTime, // Assuming the slot model has a `startTime` field
          endTime: payment.sessionId.slotId.endTime, // Assuming the slot model has an `endTime` field
          tutoringFee: payment.tutoringFee,
          paymentStatus: payment.paymentStatus,
        };
      } else {
        console.log("Missing session or slot information for payment:", payment);
        return null; // Return null if session or slot details are missing
      }
    }).filter(detail => detail !== null); // Filter out any null entries

   
    res.status(200).json(paymentDetails);
  } catch (error) {
    console.error("Error fetching payment details:", error);
    res.status(500).json({ message: 'Error fetching payment details', error });
  }
};

export const getBlockedStatus = async (req, res) => {
  try {
    const tutorId = req.user.id; 
    console.log(tutorId)
    const tutor = await Tutor.findById(tutorId);

    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    res.json({ isBlocked: tutor.isBlocked });
  } catch (error) {
    console.error('Error fetching blocked status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
