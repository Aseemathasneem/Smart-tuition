import React from 'react';

const Cancel = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">Payment Canceled</h2>
        <p className="text-gray-800 dark:text-gray-200">Your payment was canceled. Please try again.</p>
      </div>
    </div>
  );
};

export default Cancel;