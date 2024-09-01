import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { apiCall } from '../../api/apiCalls';
import endpoints from '../../api/endpoints';

const PrivateRoutes = () => {
  const [isBlocked, setIsBlocked] = useState(null);
  const token = localStorage.getItem('tu_token');

  useEffect(() => {
    const fetchBlockedStatus = async () => {
      if (token) {
        try {
          
          const data = await apiCall('get',endpoints. GET_TUTOR_STATUS);
         
          setIsBlocked(data.isBlocked);
        } catch (error) {
          console.error('Error fetching blocked status:', error);
          setIsBlocked(true); 
        }
      } else {
        setIsBlocked(false); // No token case handled here to skip the blocked check
      }
    };

    fetchBlockedStatus();
  }, [token]);

  if (!token) {
    return <Navigate to="/tutor/home" />;
  }

  if (isBlocked === null) {
    // Optionally, show a loading spinner or some other UI while the status is being fetched
    return <div>Loading...</div>;
  }

  return isBlocked ? <Navigate to="/tutor/blocked" /> : <Outlet />;
};

export default PrivateRoutes;
