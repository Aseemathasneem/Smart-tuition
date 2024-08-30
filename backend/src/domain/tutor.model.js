import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const tutorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  isBlocked: { type: Boolean, default: false },
  otp: {
    type: String,
  },
  otp_expires: {
    type: Date,
  },
  otp_resend_count: {
    type: Number,
    default: 0,
  },
  otp_last_resend: {
    type: Date,
  },
  role: {
    type: String,
    enum: ['tutor'],
    default: 'tutor'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  qualification: {
    type: String,
  },
  classes: {
    type: [String],
  },
  subjects: {
    type: String,
  },
  hourlyRate: {
    type: Number,
  },
  syllabus: {
    type: [String],
  },
  experience: {
    type: Number,  
    required: true,
    default: 0,  
  },
  bio: {
    type: String,
  },
  certificate: {
    type: String,
  },
  rating: { type: Number, default: 0 },
 
 
}, { timestamps: true });

// Method to hash OTP before saving
tutorSchema.pre('save', async function (next) {
  if (this.isModified('otp') && this.otp) {
    try {
      this.otp = await bcrypt.hash(this.otp, 10);
    } catch (err) {
      return next(err);
    }
  }
  next();
});

const Tutor = mongoose.model('Tutor', tutorSchema);
export default Tutor;
