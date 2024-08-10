import mongoose from 'mongoose';

const submissionSchema =  new mongoose.Schema({
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    studentId: { type:mongoose. Schema.Types.ObjectId, ref: 'Student', required: true },
    file: { type: String, required: true },
    status: { type: String, enum: ['submitted', 'verified'], default: 'submitted' },
  }, { timestamps: true });
  
  const Submission = mongoose.model('Submission', submissionSchema);
  export default Submission;
  