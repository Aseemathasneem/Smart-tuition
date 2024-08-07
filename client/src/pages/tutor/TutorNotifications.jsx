import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { apiCall } from '../../api/apiCalls';
import endpoints from '../../api/endpoints';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

const TutorNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = useSelector(state => state.tutor.currentUser);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await apiCall('get', endpoints.GET_TUTOR_NOTIFICATIONS(currentUser._id));
        console.log('response',response.data.notifications);
        setNotifications(response.data.notifications);

      } catch (err) {
        setError(err.response ? err.response.data.message : "Server error");
        toast.error("Failed to fetch notifications");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchNotifications();
    }
  }, [currentUser]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen mt-20 p-6 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      {notifications.length > 0 ? (
        <ul className="space-y-4">
          {notifications.map(notification => (
            <li key={notification._id} className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
              <p className="text-sm text-gray-500">{new Date(notification.createdAt).toLocaleString()}</p>
              <p className="text-sm mt-2">{notification.message}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No notifications available</p>
      )}
      {/* <ToastContainer /> */}
    </div>
  );
};

export default TutorNotifications;
