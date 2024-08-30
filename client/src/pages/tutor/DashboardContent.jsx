import React, { useEffect, useState } from "react";
import { Card } from "flowbite-react";
import { FaUsers, FaClock, FaWallet } from "react-icons/fa";
import { useSelector } from "react-redux"; 
import { apiCall } from '../../api/apiCalls'; 
import endpoints from '../../api/endpoints';
import PaymentDetailsTable from "./PaymentDetailsTable";  // Importing the PaymentDetailsTable component

export default function DashboardContent() {
  const [studentCount, setStudentCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0); 
  const [totalTutoringHours, setTotalTutoringHours] = useState(0); // Add state for totalTutoringHours
  
  const currentUser = useSelector(state => state.tutor.currentUser);
  const tutorId = currentUser?._id;

  useEffect(() => {
    const fetchStudentCount = async () => {
      if (currentUser && tutorId) {
        try {
          const response = await apiCall('get', endpoints.GET_STUDENT_COUNT_BY_TUTOR(tutorId));
          setStudentCount(response.data.count); 
        } catch (error) {
          console.error("Error fetching student count:", error);
        }
      }
    };

    const fetchTotalRevenue = async () => {
      if (currentUser && tutorId) {
        try {
          const response = await apiCall('get', endpoints.GET_TUTOR_REVENUE(tutorId));
          setTotalRevenue(response.data.totalRevenue); 
        } catch (error) {
          console.error("Error fetching total revenue:", error);
        }
      }
    };

    const fetchTotalTutoringHours = async () => {
      if (currentUser && tutorId) {
        try {
          const response = await apiCall('get', endpoints. GET_TUTOR_HOURS(tutorId)); // Assuming an endpoint for tutoring hours
          setTotalTutoringHours(response.data. totalTutoringHours); 
        } catch (error) {
          console.error("Error fetching tutoring hours:", error);
        }
      }
    };

    fetchStudentCount();
    fetchTotalRevenue();
    fetchTotalTutoringHours();

  }, [tutorId, currentUser]);

  return (
    <div>
      {/* Top cards */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <Card className="bg-blue-500 dark:bg-blue-900 text-white">
          <div className="flex items-center">
            <FaUsers className="text-white text-3xl mr-2" />
            <div>
              <h5 className="text-xl font-bold">Total Students</h5>
              <p className="text-2xl font-bold">{studentCount}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-green-500 dark:bg-green-900 text-white">
          <div className="flex items-center">
            <FaClock className="text-white text-3xl mr-2" />
            <div>
              <h5 className="text-xl font-bold">Total Tutoring Hours</h5>
              <p className="text-2xl font-bold">{totalTutoringHours}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-yellow-500 dark:bg-yellow-900 text-white">
          <div className="flex items-center">
            <FaWallet className="text-white text-3xl mr-2" />
            <div>
              <h5 className="text-xl font-bold">Total Revenue</h5>
              <p className="text-2xl font-bold">{totalRevenue}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Payment Details Table */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
        <PaymentDetailsTable tutorId={tutorId} />
      </div>
    </div>
  );
}
