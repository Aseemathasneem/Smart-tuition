import mongoose from 'mongoose';


const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['assigned', 'completed', 'verified'], default: 'assigned' },
  tutorId: { type:mongoose.Schema.Types.ObjectId, ref: 'Tutor', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  instructions: { type: String, required: true },
  grade: { type: Number, required: true },
}, { timestamps: true });

const Assignment = mongoose.model('Assignment', assignmentSchema);
export default Assignment;
