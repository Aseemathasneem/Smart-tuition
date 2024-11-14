import React from "react";
import { TextInput } from "flowbite-react";
import GradientButton from "../../components/GradientButton"; // Adjust the import path as needed

export default function Home() {
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

      <section class="py-24 mt-[-4rem]">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="mb-12">
            <h2 class="text-3xl font-semibold tracking-wide text-gray-800 dark:text-white lg:text-4xl text-center">
              Top Tutors
            </h2>
          </div>
          <div class="grid grid-cols-1 min-[500px]:grid-cols-2 md:grid-cols-6 lg:grid-cols-5 gap-8 max-w-xl mx-auto md:max-w-3xl lg:max-w-full">
            {/* <!-- Tutor 1 --> */}
            <div class="block group md:col-span-2 lg:col-span-1">
              <div class="relative mb-6">
                <img
                  src="https://pagedone.io/asset/uploads/1696238374.png"
                  alt="Antonio image"
                  class="w-40 h-40 rounded-full mx-auto transition-all duration-500 object-cover border border-solid border-transparent group-hover:border-indigo-600"
                />
              </div>
              <h4 class="text-xl font-semibold text-gray-900 mb-2 capitalize text-center transition-all duration-500 group-hover:text-indigo-600">
                Tutor 1 Name
              </h4>
              <span class="text-gray-500 text-center block transition-all duration-500 group-hover:text-gray-900">
                Mathematics
              </span>
              <p class="text-center text-sm mt-2 text-gray-600">
                "Helping students excel in mathematics ."
              </p>
              <div class="text-yellow-500 text-center text-lg mt-2">
                {"★".repeat(5)}
                {"☆".repeat(0)}
              </div>
            </div>

            {/* <!-- Tutor 2 --> */}
            <div class="block group md:col-span-2 lg:col-span-1">
              <div class="relative mb-6">
                <img
                  src="	https://pagedone.io/asset/uploads/1696238425.png"
                  alt="Yasmine image"
                  class="w-40 h-40 rounded-full mx-auto transition-all duration-500 object-cover border border-solid border-transparent group-hover:border-indigo-600"
                />
              </div>
              <h4 class="text-xl font-semibold text-gray-900 mb-2 capitalize text-center transition-all duration-500 group-hover:text-indigo-600">
                Tutor 2 Name
              </h4>
              <span class="text-gray-500 text-center block transition-all duration-500 group-hover:text-gray-900">
                Physics
              </span>
              <p class="text-center text-sm mt-2 text-gray-600">
                "Expert in simplifying complex physics concepts."
              </p>
              <div class="text-yellow-500 text-center text-lg mt-2">
                {"★".repeat(4)}
                {"☆".repeat(1)}
              </div>
            </div>

            {/* <!-- Tutor 3 --> */}
            <div class="group group md:col-span-2 lg:col-span-1">
              <div class="relative mb-6">
                <img
                  src="https://pagedone.io/asset/uploads/1696238396.png"
                  alt="Patricia image"
                  class="w-40 h-40 rounded-full mx-auto transition-all duration-500 object-cover border border-solid border-transparent group-hover:border-indigo-600"
                />
              </div>
              <h4 class="text-xl font-semibold text-gray-900 mb-2 capitalize text-center transition-all duration-500 group-hover:text-indigo-600">
                Tutor 3 Name
              </h4>
              <span class="text-gray-500 text-center block transition-all duration-500 group-hover:text-gray-900">
                Chemistry
              </span>
              <p class="text-center text-sm mt-2 text-gray-600">
                "Passionate about making chemistry fun and accessible."
              </p>
              <div class="text-yellow-500 text-center text-lg mt-2">
                {"★".repeat(5)}
                {"☆".repeat(0)}
              </div>
            </div>

            {/* <!-- Tutor 4 --> */}
            <div class="block group md:col-span-2 lg:col-span-1 md:col-start-2 lg:col-start-4">
              <div class="relative mb-6">
                <img
                  src="	https://pagedone.io/asset/uploads/1696238411.png"
                  alt="Jerom image"
                  class="w-40 h-40 rounded-full mx-auto transition-all duration-500 object-cover border border-solid border-transparent group-hover:border-indigo-600"
                />
              </div>
              <h4 class="text-xl font-semibold text-gray-900 mb-2 capitalize text-center transition-all duration-500 group-hover:text-indigo-600">
                Tutor 4 Name
              </h4>
              <span class="text-gray-500 text-center block transition-all duration-500 group-hover:text-gray-900">
                English
              </span>
              <p class="text-center text-sm mt-2 text-gray-600">
                "Improving communication skills with engaging lessons."
              </p>
              <div class="text-yellow-500 text-center text-lg mt-2">
                {"★".repeat(4)}
                {"☆".repeat(1)}
              </div>
            </div>

            {/* <!-- Tutor 5 --> */}
            <div class="block group min-[500px]:col-span-2 mx-auto md:col-span-2 lg:col-span-1">
              <div class="relative mb-6">
                <img
                  src="https://pagedone.io/asset/uploads/1696238446.png"
                  alt="Martin image"
                  class="w-40 h-40 rounded-full mx-auto transition-all duration-500 object-cover border border-solid border-transparent group-hover:border-indigo-600"
                />
              </div>
              <h4 class="text-xl font-semibold text-gray-900 mb-2 capitalize text-center transition-all duration-500 group-hover:text-indigo-600">
                Tutor 5 Name
              </h4>
              <span class="text-gray-500 text-center block transition-all duration-500 group-hover:text-gray-900">
                Biology
              </span>
              <p class="text-center text-sm mt-2 text-gray-600">
                "Bringing biology to life with interactive teaching methods."
              </p>
              <div class="text-yellow-500 text-center text-lg mt-2">
                {"★".repeat(5)}
                {"☆".repeat(0)}
              </div>
            </div>
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
