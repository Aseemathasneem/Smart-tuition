import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { apiCall } from "../../api/apiCalls";
import endpoints from "../../api/endpoints";
import GradientButton from "../../components/GradientButton";
import { useToast } from '../../contexts/ToastContext';
import {
  Spinner,
  Alert,
  Card,
  Avatar,
  Badge,
  Button,
  Modal,
} from "flowbite-react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SlotTable from "../../components/SlotTable";
import ReviewCard from "../../components/ReviewCard";

const TutorDetails = () => {
  const showToast = useToast();
  const navigate = useNavigate();
  const { tutorId } = useParams();
  const [tutor, setTutor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [sessionDetails, setSessionDetails] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const currentUser = useSelector((state) => state.student.currentUser);

  useEffect(() => {
    const fetchTutorDetails = async () => {
      try {
        const response = await apiCall(
          "get",
          endpoints.GET_TUTOR_DETAILS(tutorId)
        );
        setTutor(response.data.tutor);
      } catch (err) {
        setError(err.response ? err.response.data.message : "Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchTutorDetails();
  }, [tutorId]);

  const fetchSlotsByDate = async (date) => {
    try {
      const adjustedDate = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      );
      const response = await apiCall(
        "get",
        `${endpoints.GET_SLOTS_BY_DATE(tutorId)}?date=${adjustedDate.toISOString()}`
      );
      setSlots(response.data.slots);
    } catch (err) {
      toast.error("Failed to fetch slots for the selected date");
    }
  };

  const handleBookSlot = async (slot) => {
    try {
      const response = await apiCall("post", endpoints.BOOK_SLOT, {
        tutorId,
        studentId: currentUser._id,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
      });

      if (response.status === 200) {
        setSessionDetails({
          tutorId,
          studentId: currentUser._id,
          tutorName: tutor.name,
          date: formatDate(slot.date), // Format date here
        startTime: formatTime(slot.startTime), // Format start time here
        endTime: formatTime(slot.endTime), // Format end time here
          subjects: tutor.subjects,
          amount: tutor.hourlyRate,
          slotId: slot._id,
        });
        setModalVisible(true);
      } else {
        throw new Error(response.data.message || "Failed to book slot");
      }
    } catch (error) {
      toast.error(`Failed to book slot: ${error.message}`);
    }
  };

  
  const handleProceedToPayment = () => {
    console.log("Proceed to payment");
    setModalVisible(false);
    navigate('/student/payment-summary', { state: sessionDetails });
    toast.success("Slot booked successfully after payment");
  };
  const handleDateChange = (date) => {
    const today = new Date(); 
    today.setHours(0, 0, 0, 0); 
    date.setHours(0, 0, 0, 0);
  
    if (date < today) {
      showToast('You cannot select a past date. Please choose a valid date.', 'error');
      return;
    }
  
    setSelectedDate(date);
    fetchSlotsByDate(date);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const parsedClasses = JSON.parse(tutor?.classes || "[]");
  const parsedSyllabus = JSON.parse(tutor?.syllabus || "[]");

  return (
    <div className="min-h-screen flex justify-center items-start gap-4 bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-xl rounded-lg shadow-md mt-10">
        <div className="flex items-center p-4 border-b">
          <Avatar img={tutor?.profilePicture} size="xl" />
          <div className="ml-4">
            <h5 className="text-xl font-bold">{tutor?.name}</h5>
            <p className="text-gray-600">{tutor?.subjects + " Tutor"}</p>
          </div>
          <div className="ml-auto">
            <Badge color="green" className="mt-2">
              {tutor?.experience} years experience
            </Badge>
          </div>
        </div>
        <div className="p-4">
          <p className="text-gray-600 ">{tutor?.bio}</p>
          <div className="mt-2">
            <span className="text-gray-500 mr-2">
              Classes: {parsedClasses.join(", ")}
            </span>
            <span className="text-gray-500 block">
              Syllabus: {parsedSyllabus.join(", ")}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-gray-500">
              Qualification: {tutor?.qualification}
            </p>
            <p className="text-gray-500 mt-1">
              Hourly Rate: {"RS " + (tutor?.hourlyRate || "0")}
            </p>
          </div>

          <div className="mt-4">
          <h3 className="text-xl font-semibold">Select Date for Booking</h3>
          <p>Enter your preferred date for booking</p>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            className="mt-2 w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>

          {selectedDate && (
            <>
              {slots.length > 0 ? (
                <SlotTable
                  slots={slots}
                  onBookSlot={handleBookSlot}
                  onDateChange={handleDateChange}
                />
              ) : (
                <div className="text-center mt-4 text-gray-500">
                  No available slot on the date.
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      <div className="w-full max-w-xs">
        <h3 className="text-xl font-semibold mb-4">Reviews</h3>
        <div className="space-y-4">
         <ReviewCard tutorId={tutorId}/>
        </div>
      </div>

      <Modal
        show={modalVisible}
        onClose={() => setModalVisible(false)}
        size="lg"
      >
        <Modal.Header>Session Details</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <p className="text-gray-500">
              <strong>Subject:</strong> {sessionDetails?.subjects}
            </p>
            <p className="text-gray-500">
              <strong>Tutor:</strong> {sessionDetails?.tutorName}
            </p>
            <p className="text-gray-500">
              <strong>Date:</strong> {sessionDetails?.date}
            </p>
            <p className="text-gray-500">
              <strong>Start Time:</strong> {sessionDetails?.startTime}
            </p>
            <p className="text-gray-500">
              <strong>End Time:</strong> {sessionDetails?.endTime}
            </p>
            <p className="text-gray-500">
              <strong>Amount:</strong> {"RS " + sessionDetails?.amount}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
        <GradientButton onClick={handleProceedToPayment}>
              Proceed to Payment
              
          </GradientButton>
        </Modal.Footer>
      </Modal>

     
    </div>
  );
};

export default TutorDetails;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours, 10);
  const isPM = hour >= 12;
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${isPM ? "PM" : "AM"}`;
};
