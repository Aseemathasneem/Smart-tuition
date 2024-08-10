import React, { useState } from 'react';
import { Modal, Textarea, Button } from 'flowbite-react';
import { FaStar } from 'react-icons/fa'; // Importing star icon from react-icons

const ReviewModal = ({ show, onClose, onSubmit }) => {
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5); // Assuming a 5-star rating system
  const [hover, setHover] = useState(null); // For hover effect on stars

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
            <label>Rating:</label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  size={30}
                  className="cursor-pointer"
                  color={star <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(null)}
                />
              ))}
            </div>
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
