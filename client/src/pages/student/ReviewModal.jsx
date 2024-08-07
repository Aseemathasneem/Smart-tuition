import React, { useState } from 'react';
import { Modal, Textarea, Button } from 'flowbite-react';

const ReviewModal = ({ show, onClose, onSubmit }) => {
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5); // Assuming a 5-star rating system

  const handleSubmit = () => {
    onSubmit({ review, rating });
    setReview('');
    setRating(5);
    onClose();
  };

  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>
        Rate and Review Tutor
      </Modal.Header>
      <Modal.Body>
        <div className="flex flex-col gap-4">
          <Textarea
            placeholder="Write your review here..."
            rows={4}
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <label htmlFor="rating">Rating:</label>
            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="p-2 border rounded"
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <option key={star} value={star}>{star}</option>
              ))}
            </select>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit}>Submit Review</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReviewModal;
