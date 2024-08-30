import React from 'react';

const BlockedError = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-red-600">Access Denied</h1>
      <p className="mt-4 text-xl text-gray-700 dark:text-gray-300">
        You are blocked by admin, please contact support.
      </p>
    </div>
  );
};

export default BlockedError;
