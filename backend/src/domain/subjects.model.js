import mongoose from 'mongoose';

// Define the Subjects Schema
const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update the updatedAt field on save
subjectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});




const Subject = mongoose.model('Subject', subjectSchema);
export default Subject;