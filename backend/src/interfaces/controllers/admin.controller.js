import Admin from '../../domain/admin.model.js';
import Student from '../../domain/student.model.js';
import Tutor from '../../domain/tutor.model.js';
import Payment from '../../domain/payment.model.js'
import Assignment from '../../domain/assignment.model.js';
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

export const getAdminRevenue = async (req, res) => {
  try {
    // Aggregate all payments to calculate total revenue
    const payments = await Payment.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    // If no payments found, set totalRevenue to 0
    const totalRevenue = payments.length > 0 ? payments[0].totalRevenue : 0;

    res.json({ totalRevenue });
  } catch (error) {
    console.error('Error fetching admin revenue:', error);
    res.status(500).json({ error: 'Failed to fetch admin revenue', details: error.message });
  }
};

export const getTotalStudents = async (req, res) => {
  try {
    const count = await Student.countDocuments(); 
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching total students', error });
  }
};

export const getTotalTutors = async (req, res) => {
  try {
    const count = await Tutor.countDocuments({ status: 'approved' }); 
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching total tutors', error });
  }
};

export const getAdminPaymentDetails = async (req, res) => {
  try {
    // Fetch all payments
    const payments = await Payment.find()
      .populate({
        path: 'sessionId',
        populate: [
          {
            path: 'tutorId',
            model: 'Tutor', // Assuming the tutor is in the User model
            select: 'name', // Adjust field names based on your User model
          },
          {
            path: 'studentId',
            model: 'Student', // Assuming the student is in the User model
            select: 'name', // Adjust field names based on your User model
          },
          {
            path: 'slotId',
            model: 'Slot',
          }
        ]
      })
      .select('tutoringFee platformFee totalAmount paymentStatus') // Select relevant fields from Payment model

    // Check if payments were found
    if (!payments || payments.length === 0) {
      return res.status(404).json({ message: 'No payment details found' });
    }

    // Map through the payments and extract required details
    const paymentDetails = payments.map(payment => {
      if (payment.sessionId && payment.sessionId.slotId && payment.sessionId.tutorId && payment.sessionId.studentId) {
        return {
          sessionDate: payment.sessionId.slotId.date, // Assuming the slot model has a `date` field
          studentName: payment.sessionId.studentId.name, // Assuming the User model has a `name` field
          tutorName: payment.sessionId.tutorId.name, // Assuming the User model has a `name` field
          tutoringFee: payment.tutoringFee,
          platformFee: payment.platformFee,
          totalAmount: payment.totalAmount,
          paymentStatus: payment.paymentStatus,
        };
      } else {
        return null; // Return null if session or slot details are missing
      }
    }).filter(detail => detail !== null); // Filter out any null entries

    res.status(200).json(paymentDetails);
  } catch (error) {
    console.error("Error fetching payment details:", error);
    res.status(500).json({ message: 'Error fetching payment details', error });
  }
};




