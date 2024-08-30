// NotificationContext.js
import React, { createContext, useState } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message) => {
    setNotifications((prevNotifications) => {
      // Check if a notification with the same message already exists
      const isDuplicate = prevNotifications.some(
        (notif) => notif.message === message.message
      );
      if (!isDuplicate) {
        return [...prevNotifications, message];
      }
      return prevNotifications;
    });
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
