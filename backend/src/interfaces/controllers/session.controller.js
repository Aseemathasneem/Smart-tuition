// controllers/session.controller.js
import Session from '../../domain/session.model.js';

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
    
    const session = await Session.findOneAndUpdate(
      { 
        '_id': sessionId,       // Find session by slotId
        'status': 'confirmed'   // Ensure the session status is confirmed
      },
      { status: 'cancelled' },  // Update status to cancelled
      { new: true }              // Return the updated document
    );

    if (!session) {
      return res.status(404).json({ message: 'Session not found or not confirmed' });
    }

    res.json(session);
  } catch (error) {
    console.error('Error cancelling session:', error);
    res.status(500).json({ message: error.message });
  }
};

