import Admin from '../../domain/admin.model.js';
import Student from '../../domain/student.model.js';
import Tutor from '../../domain/tutor.model.js';
import nodemailer from 'nodemailer';
import ApprovalRequest from '../../domain/approvalRequest.model.js';
import {
  signup,
  resendOtp,
  verifyOtp,
  signin,
  googleSignIn,
  getUserData
} from '../../utils/authUtils.js';

export const adminSignUp = (req, res, next) => signup(Admin, req, res, next);
export const adminResendOtp = (req, res, next) => resendOtp(Admin, req, res, next);
export const adminVerifyOtp = (req, res, next) => verifyOtp(Admin, req, res, next);
export const adminSignIn = (req, res, next) => signin(Admin, req, res, next);
export const adminGoogleSignIn = (req, res, next) => googleSignIn(Admin, req, res, next);
export const getAdminData = (req, res, next) => { getUserData(Admin, req, res, next);};
export const signout = (req, res, next) => {
  try {
    res
      .clearCookie('admin_accessToken')
      .status(200)
      .json('User has been signed out');
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

export const fetchTutors = async (req, res, next) => {
  try {
    
    const tutors = await Tutor.find({});
    
    res.status(200).json(tutors);
  } catch (error) {
    
    next(error);
  }
};

// Block a student
export const blockStudent = async (req, res, next) => {
  const { studentId } = req.body;
  try {
    const student = await Student.findByIdAndUpdate(studentId, { isBlocked: true }, { new: true });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    next(error);
  }
};

// Unblock a student
export  const unblockStudent = async (req, res, next) => {
  const { studentId } = req.body;
  try {
    const student = await Student.findByIdAndUpdate(studentId, { isBlocked: false }, { new: true });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    next(error);
  }
};
export const blockTutor = async (req, res, next) => {
  const { tutorId } = req.body;
  try {
    const tutor = await Tutor.findByIdAndUpdate(tutorId, { isBlocked: true }, { new: true });
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }
    res.status(200).json(tutor);
  } catch (error) {
    next(error);
  }
};

export const unblockTutor = async (req, res, next) => {
  const { tutorId } = req.body;
  try {
    const tutor = await Tutor.findByIdAndUpdate(tutorId, { isBlocked: false }, { new: true });
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }
    res.status(200).json(tutor);
  } catch (error) {
    next(error);
  }
};

// controllers/approvalRequestsController.js


export const getApprovalRequests = async (req, res, next) => {
  try {
    
    const approvalRequests = await ApprovalRequest.find().populate('tutor');
    
    res.status(200).json(approvalRequests);
  } catch (error) {
    next(error);
  }
};

export const approveRequest = async (req, res, next) => {
  const { requestId } = req.body;
  try {
    const request = await ApprovalRequest.findById(requestId);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const tutorId =  request.tutor
   
   
    const tutor = await Tutor.findById(tutorId);
    
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }
    tutor.status = 'approved';
    await tutor.save();

    // Delete the approval request
    await ApprovalRequest.findByIdAndDelete(requestId);

    res.status(200).json({ message: 'Request approved and deleted', tutor });
  } catch (error) {
    next(error);
  }
};

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendRejectionEmail = async (email, reason) => {
  const mailOptions = {
    from:process.env.EMAIL_USER ,
    to: email,
    subject: 'Rejection Notice',
    text: `Dear Tutor,

    We regret to inform you that your request has been rejected for the following reason:

    ${reason}

    Please feel free to reach out if you have any questions.

    Best regards,
    Smart Tuition Team`,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log('Rejection email sent successfully');
  } catch (error) {
    console.error('Error sending rejection email:', error);
  }
};

export const rejectRequest = async (req, res, next) => {
  const { requestId, reason } = req.body; // Ensure the frontend sends the reason
  try {
    const request = await ApprovalRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Update tutor's status to 'rejected'
    const tutor = await Tutor.findById(request.tutor);
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }
    tutor.status = 'rejected';
    await tutor.save();

    // Delete the approval request
    await ApprovalRequest.findByIdAndDelete(requestId);

    // Send rejection email
    await sendRejectionEmail(tutor.email, reason);

    res.status(200).json({ message: 'Request rejected and deleted', tutor });
  } catch (error) {
    next(error);
  }
};



