import React, { useEffect } from 'react';
import socket from '../socket';

const NotificationHandler = ({ userId, onNewNotification }) => {
  useEffect(() => {
    if (userId) {
      socket.emit('join', userId);
      console.log('User joined room:', userId);
    }

    const handleNotification = (message) => {
      onNewNotification(message);
    };

    socket.on('sendNotification', handleNotification);

    // Cleanup function to remove the listener when the component unmounts
    return () => {
      if (userId) {
        socket.emit('leave', userId);
        console.log('User left room:', userId);
      }
      socket.off('sendNotification', handleNotification);  // Remove the specific listener
    };
  }, [userId, onNewNotification]);

  return null;
};

export default NotificationHandler;

