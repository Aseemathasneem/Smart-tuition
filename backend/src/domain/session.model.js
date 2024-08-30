import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tutor',
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Slot',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed','refunded'],
    default: 'pending'
  },
  paymentIntentId: {
    type: String,  
    required: false,
  },
  studentAttended: {
    type: Boolean,
    default: false,
  },
  tutorAttended: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Session = mongoose.model('Session', sessionSchema);
export default Session;
