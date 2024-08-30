import React, { useEffect, useState } from 'react';
import { Card } from 'flowbite-react';
import { FaUsers, FaChalkboardTeacher, FaRupeeSign } from 'react-icons/fa';
import { apiCall } from '../../api/apiCalls'; // Import your API call function
import endpoints from '../../api/endpoints'; // Import your API endpoint
import PaymentDetailsTable from './PaymentDetails'; // Ensure the path is correct

const AdminDashboard = () => {
  const [studentCount, setStudentCount] = useState(0);
  const [tutorCount, setTutorCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        const response = await apiCall('get', endpoints.GET_TOTAL_STUDENTS);
        setStudentCount(response.data.count); // Assuming the count is returned as `count`
      } catch (error) {
        console.error("Error fetching student count:", error);
      }
    };

    const fetchTutorCount = async () => {
      try {
        const response = await apiCall('get', endpoints.GET_TOTAL_TUTORS);
        setTutorCount(response.data.count); // Assuming the count is returned as `count`
      } catch (error) {
        console.error("Error fetching tutor count:", error);
      }
    };

    const fetchTotalRevenue = async () => {
      try {
        const response = await apiCall('get', endpoints.GET_TOTAL_REVENUE);
        setTotalRevenue(response.data.totalRevenue); // Assuming total revenue is returned as `totalRevenue`
      } catch (error) {
        console.error("Error fetching total revenue:", error);
      }
    };

    fetchStudentCount();
    fetchTutorCount();
    fetchTotalRevenue();
  }, []);

  return (
    <div className="p-4 md:p-8">
      {/* Top cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
            <FaChalkboardTeacher className="text-white text-3xl mr-2" />
            <div>
              <h5 className="text-xl font-bold">Total Tutors</h5>
              <p className="text-2xl font-bold">{tutorCount}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-yellow-500 dark:bg-yellow-900 text-white">
          <div className="flex items-center">
            <FaRupeeSign className="text-white text-3xl mr-2" />
            <div>
              <h5 className="text-xl font-bold">Total Revenue</h5>
              <p className="text-2xl font-bold">{totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tables and graphs */}
      <div className="grid grid-cols-1 gap-4 mb-4">
        <PaymentDetailsTable />
      </div>
    </div>
  );
};

export default AdminDashboard;
