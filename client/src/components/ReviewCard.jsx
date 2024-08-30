import React, { useState, useEffect } from "react";
import { apiCall } from "../api/apiCalls";
import endpoints from "../api/endpoints";

const ReviewCard = ({ tutorId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await apiCall("get", endpoints.GET_TUTOR_REVIEWS(tutorId));
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [tutorId]);

  return (
    <div>
      {reviews.map((review) => (
        <div key={review._id} className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4 mb-4">
          <p className="text-sm font-bold">{review.studentId.name}</p>
          <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
          <p className="text-sm mt-2">{review.review}</p>
          <p className="text-yellow-500 text-lg">
            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ReviewCard;
