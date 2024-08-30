
import Student from '../../domain/student.model.js';
import Tutor from '../../domain/tutor.model.js';
import Slot from '../../domain/slot.model.js'
import Session from '../../domain/session.model.js'
import Assignment from '../../domain/assignment.model.js'
import Notification from '../../domain/notification.model.js';
import Submission from '../../domain/submission.model.js'
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

    // No need to fetch slots here
    res.json({ tutor });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getSlotsByDate = async (req, res) => {
  try {
    const { tutorId } = req.params;
    const { date } = req.query;
   

    const slots = await Slot.find({
      tutorId,
      date: new Date(date).toISOString().split("T")[0], 
      status: "available",
    });

    res.json({ slots });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const bookSlot = async (req, res) => {
  const { tutorId, studentId, date, startTime, endTime } = req.body;
  console.log(req.body)

  try {
    

    const tutor = await Tutor.findById(tutorId);
    const student = await Student.findById(studentId);

    if (!tutor || !student) {
     
      return res.status(404).json({ message: 'Tutor or student not found' });
    }

    const slot = await Slot.findOne({
      tutorId,
      date,
      startTime,
      endTime,
      status: 'available'
    });

    if (!slot) {
      
      return res.status(400).json({ message: 'Slot not available' });
    }

    console.log("Slot:", slot);

    // Create a new session with status pending
    const session = new Session({
      tutorId,
      studentId,
      slotId: slot._id,
      status: 'pending',
      paymentStatus: 'pending'
    });

    

    // Update slot with studentId and status
    slot.studentId = studentId;
    slot.status = 'booked';

    await slot.save();
    

    await session.save();
    
    
    res.status(200).json({ message: 'Slot booked successfully with pending status', slotId: slot._id });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
export const fetchBookedSlots = async (req, res) => {
  try {
    const { studentId } = req.params;

  
    const sessions = await Session.find({ studentId, status: 'confirmed' }).populate('slotId tutorId');

   

    // Extract necessary slot details
    const bookedSlots = sessions.map(session => ({
      sessionId: session._id,
      tutorId: session.tutorId,
      date: session.slotId.date,
      startTime: session.slotId.startTime,
      endTime: session.slotId.endTime
    }));

    res.status(200).json(bookedSlots);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getNotifications = async (req, res, next) => {
  try {
    const { userId } = req.params; // Access userId from route parameters
    const notifications = await Notification.find({
      userId,
      userType: 'student',
    }).sort({ createdAt: -1 });
    res.status(200).json({ notifications });
  } catch (error) {
    next(error);
  }
};

export const getAssignmentsByStudent = async (req, res) => {
  const { studentId } = req.params;
  

  try {
    const assignments = await Assignment.find({ studentId })
      .populate('tutorId', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assignments for the student', error });
  }
};

 export const submitAnswer = async (req, res) => {
  try {
    const { assignmentId, studentId } = req.body;
    
    const file = req.file.path;

    // Create a new submission
    const newSubmission = new Submission({
      assignmentId,
      studentId,
     
      file
    });

    await newSubmission.save();

    // Update the assignment status to completed
    await Assignment.findByIdAndUpdate(assignmentId, { status: 'completed' });

    res.status(201).json({ message: 'Answer submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
