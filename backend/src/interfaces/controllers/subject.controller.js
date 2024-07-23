import Subject from '../../domain/subjects.model.js'
import { errorHandler } from '../../utils/error.js';

export const getSubjects = async (req, res, next) => {
    try {
        const subjects = await Subject.find();
        res.status(200).json(subjects);
    } catch (error) {
        next(errorHandler(500, 'Server Error'));
    }
  };

  export const addSubject = async (req, res, next) => {
    try {
      const { name } = req.body;
  
      // Check if the subject already exists
      const existingSubject = await Subject.findOne({ name });
      if (existingSubject) {
        return next(errorHandler(400, 'Subject already exists'));
      }
  
      const newSubject = new Subject({ name });
      await newSubject.save();
  
      res.status(201).json(newSubject);
    } catch (error) {
      next(errorHandler(500, 'Server Error'));
    }
  };
  export const updateSubject = async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    
  
    try {
      const subject = await Subject.findById(id);
  
      if (!subject) {
        return next(errorHandler(404, 'Subject not found'));
      }
  
      subject.name = name || subject.name;
      const updatedSubject = await subject.save();
  
      res.status(200).json(updatedSubject);
    } catch (error) {
      next(errorHandler(500, 'Server Error'));
    }
  };

  export const deleteSubject = async (req, res, next) => {
    const { id } = req.params;
  
    try {
      console.log('Request received to delete subject with id:', id);
      
      const subject = await Subject.findByIdAndDelete(id);
  
      if (!subject) {
        return next(errorHandler(404, 'Subject not found'));
      }
  
      res.status(200).json({ message: 'Subject deleted successfully' });
    } catch (error) {
      next(errorHandler(500, 'Internal server error'));
    }
  };