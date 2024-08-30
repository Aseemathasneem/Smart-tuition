import { Button } from 'flowbite-react';
import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import GradientButton from '../../components/GradientButton';

const Success = () => {
    const navigate = useNavigate();

    const handleContinue = () => {
        navigate('/student/home'); // Navigate to the home page
      };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md text-center">
      <div className="flex justify-center mb-4">
          <FaCheckCircle className="text-green-500 text-6xl" />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">Payment Successful!</h2>
        <p className="text-gray-800 dark:text-gray-200">Thank you for your payment!</p>
        <GradientButton
          onClick={handleContinue}
          className="mt-4 w-full"
        >
          Continue
        </GradientButton>
      </div>
    </div>
  );
};

export default Success;