import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from "react-router-dom";
import { apiCall } from "../../api/apiCalls";
import endpoints from "../../api/endpoints";
import { Spinner, Alert, Button, Modal } from "flowbite-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SlotTable from "../../components/SlotTable";  
import ReviewCard from "../../components/ReviewCard";  // Import the ReviewCard component

const TutorDetails = () => {
  const navigate = useNavigate();
  const { tutorId } = useParams();
  const [tutor, setTutor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [reviews, setReviews] = useState([]); // Add state for reviews
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); 
  const [sessionDetails, setSessionDetails] = useState(null); 
  const currentUser = useSelector(state => state.student.currentUser);

  useEffect(() => {
    const fetchTutorDetails = async () => {
      try {
        const response = await apiCall("get", endpoints.GET_TUTOR_DETAILS(tutorId));
        setTutor(response.data.tutor);
        setSlots(response.data.slots);
      } catch (err) {
        setError(err.response ? err.response.data.message : "Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchTutorDetails();
  }, [tutorId]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await apiCall("get", endpoints.GET_TUTOR_REVIEWS(tutorId));
        console.log("Reviews response:", response.data); // Log the response
        setReviews(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        toast.error("Failed to fetch reviews");
      }
    };

    fetchReviews();
  }, [tutorId]);
 
  const handleBookSlot = async (slot) => {
    try {
      const response = await apiCall('post', endpoints.BOOK_SLOT, {
        tutorId,
        studentId: currentUser._id, 
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
      });
      
      setSessionDetails({
        tutorId, 
        studentId: currentUser._id, 
        tutorName: tutor.name,
        date: new Date(slot.date).toLocaleDateString(),
        startTime: slot.startTime,
        endTime: slot.endTime,
        subjects: tutor.subjects.join(", "),
        amount: tutor.hourlyRate, 
        slotId: slot._id, 
      });
      setModalVisible(true);
    } catch (error) {
      toast.error("Failed to book slot");
    }
  };

  const handleProceedToPayment = () => {
    console.log("Proceed to payment");
    setModalVisible(false);
    navigate('/student/payment-summary', { state: sessionDetails });
    toast.success("Slot booked successfully after payment");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const availableSlots = slots.filter(slot => slot.status === 'available');
  
  return (
    <div className="min-h-screen mt-20 flex justify-center items-start gap-4">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-6 max-w-xl w-full">
        <div className="flex flex-col items-center">
          <img
            src={tutor?.profilePicture}
            alt="Profile"
            className="h-24 w-24 rounded-full"
          />
          <h2 className="text-2xl font-bold mt-2">{tutor?.name}</h2>
          <p className="text-sm">{tutor?.email}</p>
          <p className="text-sm font-bold">{`Status: ${tutor?.status}`}</p>
        </div>
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Qualification</h3>
          <p>{tutor?.qualification}</p>
        </div>
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Classes for Tutoring</h3>
          <p>{tutor?.classes.join(", ")}</p>
        </div>
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Subjects for Tutoring</h3>
          <p>{tutor?.subjects.join(", ")}</p>
        </div>
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Hourly Rate</h3>
          <p>{tutor?.hourlyRate}</p>
        </div>
         <div className="mt-4">
          <h3 className="text-xl font-semibold">Available Days</h3>
          <p>{tutor?.availableDays.join(", ")}</p>
        </div>
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Bio</h3>
          <p>{tutor?.bio}</p>
        </div>
        <SlotTable slots={availableSlots} onBookSlot={handleBookSlot} />
      </div>
      <div className="w-full max-w-xs">
        <h3 className="text-xl font-semibold mb-4">Reviews</h3>
        <div className="space-y-4">
          {reviews.length > 0 ? reviews.map(review => (
            <ReviewCard key={review._id} review={review} />
          )) : <p>No reviews available</p>}
        </div>
      </div>
      <ToastContainer />
      {sessionDetails && (
        <Modal show={modalVisible} onClose={() => setModalVisible(false)}>
          <Modal.Header>
            Session Summary
          </Modal.Header>
          <Modal.Body>
            <div className="space-y-2">
              <p><strong>Tutor Name:</strong> {sessionDetails.tutorName}</p>
              <p><strong>Start Time:</strong> {sessionDetails.startTime}</p>
              <p><strong>End Time:</strong> {sessionDetails.endTime}</p>
              <p><strong>Subjects:</strong> {sessionDetails.subjects}</p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleProceedToPayment}>
              Proceed to Payment
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default TutorDetails;
