import React , { useEffect, useState } from "react";
import { apiCall } from '../../api/apiCalls';
import endpoints from '../../api/endpoints';
import GradientButton from "../../components/GradientButton"; // Adjust the import path as needed

export default function Home() {

  const [tutors, setTutors] = useState([]);

  useEffect(() => {
    const fetchTopTutors = async () => {
      try {
        const response = await apiCall('get', endpoints.GET_TOP_TUTORS);
        setTutors(response.data);
      } catch (error) {
        console.error('Failed to fetch top tutors:', error);
      }
    };

    fetchTopTutors();
  }, []);

  return (
    <div className="container mx-auto p-1">
      {/* Hero Section */}
      <section className="bg-white dark:bg-gray-900">
        <div className="container flex flex-col px-6 pb-4 py-10 mx-auto space-y-6 lg:h-[32rem] lg:py-16 lg:flex-row lg:items-center">
          <div className="w-full lg:w-1/2">
            <div className="lg:max-w-lg">
              <h1 className="text-3xl font-semibold tracking-wide text-gray-800 dark:text-white lg:text-4xl">
                Unlock Your Potential with Smart Tuition
              </h1>

              <div className="mt-8 space-y-5">
                <p className="flex items-center -mx-2 text-gray-700 dark:text-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 mx-2 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="mx-2">Personalized Learning Experience</span>
                </p>
                <p className="flex items-center -mx-2 text-gray-700 dark:text-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 mx-2 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="mx-2">Expert Tutors at Your Service</span>
                </p>
                <p className="flex items-center -mx-2 text-gray-700 dark:text-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 mx-2 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="mx-2">Flexible Scheduling</span>
                </p>
              </div>
            </div>
            {/* <div className="w-full mt-8 bg-transparent border rounded-md lg:max-w-sm dark:border-gray-700 focus-within:border-blue-400 focus-within:ring focus-within:ring-blue-300 dark:focus-within:border-blue-400 focus-within:ring-opacity-40">
              <form className="flex flex-col lg:flex-row">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 h-10 px-4 py-2 m-1 text-gray-700 placeholder-gray-400 bg-transparent border-none appearance-none dark:text-gray-200 focus:outline-none focus:placeholder-transparent focus:ring-0"
                />
                <GradientButton className="h-10 px-4 py-2 m-1">
                  Join Us
                </GradientButton>
              </form>
            </div> */}
          </div>

          <div className="flex items-center justify-center w-full h-96 lg:w-1/2">
            <img
              className="object-cover w-full h-full mx-auto rounded-md lg:max-w-2xl"
              src="/images/banner1.jpg"
            />
          </div>
        </div>
      </section>

      <section className="py-24 mt-[-4rem]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-semibold tracking-wide text-gray-800 dark:text-white lg:text-4xl text-center">
              Top Tutors
            </h2>
          </div>
          <div className="grid grid-cols-1 min-[500px]:grid-cols-2 md:grid-cols-6 lg:grid-cols-5 gap-8 max-w-xl mx-auto md:max-w-3xl lg:max-w-full">
            {tutors.map((tutor) => (
              <div key={tutor._id} className="block group md:col-span-2 lg:col-span-1">
                <div className="relative mb-6">
                  <img
                    src={tutor.profilePicture}
                    alt={`${tutor.name} image`}
                    className="w-40 h-40 rounded-full mx-auto transition-all duration-500 object-cover border border-solid border-transparent group-hover:border-indigo-600"
                  />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2 capitalize text-center transition-all duration-500 group-hover:text-indigo-600">
                  {tutor.name}
                </h4>
                <span className="text-gray-500 text-center block transition-all duration-500 group-hover:text-gray-900">
                  {tutor.subjects}
                </span>
                <div className="text-yellow-500 text-center text-lg mt-2">
                  {"★".repeat(Math.floor(tutor.rating))}
                  {"☆".repeat(5 - Math.floor(tutor.rating))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action for Students */}

      {/* Call to Action for Tutors */}
      <div className="my-8 text-center bg-gray-100 dark:bg-gray-800 p-4 rounded">
        <h2 className="text-2xl font-bold mb-4 dark:text-gray-200">
          Join Our Community of Tutors
        </h2>
        <p className="text-lg mb-4 dark:text-gray-300">
          Help students achieve their academic goals...
        </p>
        <GradientButton>Register as a Tutor</GradientButton>
      </div>
    </div>
  );
}
