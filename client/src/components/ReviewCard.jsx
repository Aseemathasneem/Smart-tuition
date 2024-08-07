import React from "react";

const ReviewCard = ({ review }) => {
 
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
      <p className="text-sm font-bold">{review.studentId.name}</p>
      <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
      <p className="text-sm mt-2">{review.review}</p>
      <p className="text-yellow-500 text-lg">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
    </div>
  );
};

export default ReviewCard;
