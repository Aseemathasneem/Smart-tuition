
import React, { useContext } from 'react';
import { NotificationContext } from '../../contexts/NotificationContext';

const TutorNotifications = () => {
  const { notifications } = useContext(NotificationContext);

  console.log("Received notifications:", notifications);

  return (
    <div className="notification-page bg-gray-100 min-h-screen p-6">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Notifications</h1>
      {notifications.length === 0 ? (
        <p className="text-lg text-gray-600">No notifications</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg shadow-lg border-l-4 ${
                notification.read ? 'bg-white text-gray-700 border-gray-300' : 'bg-white text-gray-900 border-blue-500'
              }`}
            >
              <p className="text-md font-medium">{notification.message}</p>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TutorNotifications;
