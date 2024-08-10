import React, { useEffect, useState } from 'react';
import { apiCall } from '../../api/apiCalls'; 
import endpoints from '../../api/endpoints';
import { useSelector } from 'react-redux';

const AdminRevenueCard = () => {
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUser = useSelector(state => state.admin.currentUser); 

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await apiCall('get', endpoints.GET_ADMIN_REVENUE);
        const totalRevenue = response.data.totalRevenue;

        if (typeof totalRevenue === 'number') {
          setRevenue(totalRevenue);
        } else {
          setRevenue(0); 
        }
      } catch (error) {
        setError('Failed to fetch revenue data.');
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, [currentUser]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-4">
      <h2 className="text-2xl font-semibold mb-4">Admin Revenue Overview</h2>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div>
          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold">Total Revenue</div>
            <div className="text-3xl font-bold text-green-600">${revenue.toFixed(2)}</div>
          </div>
          <div className="mt-2 text-gray-600">This is the total revenue from all tutoring sessions.</div>
        </div>
      )}
    </div>
  );
};

export default AdminRevenueCard;
