// controllers/session.controller.js
import Session from '../../domain/session.model.js';
import { refundPayment } from './payment.controller.js';

export const markAttendance = async (req, res) => {
  const { sessionId } = req.params;
  
  const { studentId, tutorId, studentAttended, tutorAttended } = req.body;


  try {
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (studentId && studentAttended !== undefined) {
      session.studentAttended = studentAttended;
    }

    if (tutorId && tutorAttended !== undefined) {
      session.tutorAttended = tutorAttended;
    }
     // Check if both student and tutor attended
     if (session.studentAttended && session.tutorAttended) {
      session.status = 'completed';
    }

    await session.save();

    res.status(200).json({ message: 'Attendance marked successfully', session });
  } catch (error) {
    res.status(500).json({ message: 'Error marking attendance', error });
  }
};

export const cancelSession = async (req, res) => {
  const { sessionId } = req.params;

  try {
    // Find and update the session with status check and populate slot details
    const session = await Session.findOneAndUpdate(
      { _id: sessionId, status: 'confirmed' },
      { status: 'cancelled' },
      { new: true } // Return the updated document
    ).populate('slotId')
    .populate('tutorId'); 

    if (!session) {
      return res.status(404).json({ message: 'Session not found or not confirmed' });
    }

    // Format date, start time, and end time for readability
    const slot = session.slotId;
    const formattedDate = slot.date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formattedStartTime = slot.startTime; // Assuming it's already formatted as a string

    // Construct notification message with populated details
    const notificationMessage = `Your session with ${session.tutorId.name} on ${formattedDate} from ${formattedStartTime} to ${slot.endTime} has been cancelled.`;

    // Emit notification to student
    req.io.to(session.studentId.toString()).emit('sendNotification', {
      message: notificationMessage
    });
    console.log('Notification sent to student:', session.studentId.toString());

    res.json({ message: 'Session cancelled successfully', session });
  } catch (error) {
    console.error('Error cancelling session:', error);
    res.status(500).json({ message: error.message });
  }
};