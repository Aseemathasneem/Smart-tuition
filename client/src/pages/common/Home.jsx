import React from 'react';
import { TextInput } from 'flowbite-react';
import GradientButton from '../../components/GradientButton'; // Adjust the import path as needed

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      {/* Find Tutor Search Bar */}
      <div className="my-4 flex justify-center">
        <TextInput
          type="text"
          placeholder="Find Tutor"
          className="w-1/2 dark:bg-gray-800 dark:text-gray-200"
        />
        <GradientButton className="ml-2">Search</GradientButton>
      </div>

      {/* Call to Action for Students */}
      <div className="my-8">
        <h2 className="text-2xl font-bold mb-4 text-center dark:text-gray-200">Unlock Your Potential with Smart Tuition</h2>
        <p className="text-lg mb-4 text-center dark:text-gray-300">
          Welcome to Smart Tuition, where your academic success is our top priority. Experience personalized one-on-one teaching tailored to your unique learning style. Our expert tutors are here to guide you every step of the way, ensuring that you master your subjects with confidence. Study at your own pace, on your own schedule, and gain access to a wealth of resources designed to make learning both effective and enjoyable. Join Smart Tuition today and take the first step towards achieving your academic goals with the best tutors at your side.
        </p>
        <div className="flex justify-center mb-8">
          <GradientButton>Get Started</GradientButton>
        </div>

        {/* How It Works Section */}
        <h2 className="text-2xl font-bold mb-4 text-center dark:text-gray-200">How It Works</h2>
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex flex-col items-center">
            <img
              src="/images/step1.png" 
              alt="Specify your requirements"
              className="w-3/4 md:w-1/2"
            />
            <h3 className="text-lg font-semibold mt-2 dark:text-gray-200">Specify your requirements</h3>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="/images/step2.png" 
              alt="Get personalised responses"
              className="w-3/4 md:w-1/2"
            />
            <h3 className="text-lg font-semibold mt-2 dark:text-gray-200">Get personalised responses</h3>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="/images/step3.png" 
              alt="Select from the best"
              className="w-3/4 md:w-1/2"
            />
            <h3 className="text-lg font-semibold mt-2 dark:text-gray-200">Select from the best</h3>
          </div>
        </div>
      </div>

      {/* Call to Action for Tutors */}
      <div className="my-8 text-center bg-gray-100 dark:bg-gray-800 p-4 rounded">
        <h2 className="text-2xl font-bold mb-4 dark:text-gray-200">Join Our Community of Tutors</h2>
        <p className="text-lg mb-4 dark:text-gray-300">Help students achieve their academic goals. Flexible scheduling and competitive compensation.</p>
        <GradientButton>Register as a Tutor</GradientButton>
      </div>
    </div>
  );
}
