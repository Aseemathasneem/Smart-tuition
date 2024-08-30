import Review from '../../domain/review.model.js';
import Tutor from '../../domain/tutor.model.js';
import { errorHandler } from '../../utils/error.js';

export const submitReview = async (req, res, next) => {
  const { studentId, tutorId, sessionId, rating, review } = req.body;

  if (!studentId || !tutorId || !sessionId || !rating || !review) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Save the new review
    const newReview = new Review({
      studentId,
      tutorId,
      sessionId,
      rating,
      review,
    });

    const savedReview = await newReview.save();

    // Calculate the new average rating
    const reviews = await Review.find({ tutorId });
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    // Update the tutor's rating field
    await Tutor.findByIdAndUpdate(tutorId, { rating: averageRating });

    res.status(201).json(savedReview);
  } catch (error) {
    next(errorHandler(500, 'Server Error'));
  }
};
  export const fetchReview = async (req, res, next) => {
    try {
      const { tutorId } = req.params;
      const reviews = await Review.find({ tutorId }).populate('studentId', 'name');
      res.status(200).json(reviews);
    } catch (error) {
      next(errorHandler(500, 'Server Error'));
    }
  };