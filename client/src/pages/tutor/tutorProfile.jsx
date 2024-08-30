import React, { useState, useEffect } from 'react';
import { apiCall } from '../../api/apiCalls';
import endpoints from '../../api/endpoints';
import { Card, Badge } from 'flowbite-react';


const TutorProfile = () => {
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTutorProfile = async () => {
      try {
        const response = await apiCall('get', endpoints.TUTOR_GET_PROFILE);
        setTutor(response.data); // Assuming data contains the tutor profile object
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tutor profile:', error);
        setError(error.message || 'Failed to fetch tutor profile');
        setLoading(false);
      }
    };

    fetchTutorProfile();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const parsedClasses = JSON.parse(tutor?.classes || '[]');
const parsedSyllabus = JSON.parse(tutor?.syllabus || '[]');
return (
  <div className="flex justify-center items-center min-h-screen p-3 w-full">
    <Card className="max-w-3xl w-full bg-gray-100 shadow-md"> 
      {tutor && (
        <>
          <div className="flex flex-col items-center">
            <img
              src={tutor.profilePicture}
              alt="Profile"
              className="h-24 w-24 rounded-full mb-4"
            />

            <h2 className="text-2xl font-bold mt-2">{tutor.name}</h2>
            <p className="text-sm">{tutor.email}</p>
            <div className="flex items-center mt-2">
              <p className="text-sm font-bold mr-2">{`Status: `}</p>
              <Badge color={tutor.status === 'Active' ? 'green' : 'yellow'}>
                {tutor.status}
              </Badge>
            </div>
          </div>
          <div className="mt-6 w-full">
          <p className="text-gray-500"> {/* Use a regular <p> element with styling */}
                {tutor.bio}
              </p>
            <h3 className="text-xl font-semibold">Qualification</h3>
            <p>{tutor.qualification}</p>
          </div>

          <div className="mt-4 w-full">
            <h3 className="text-xl font-semibold">Classes for Tutoring</h3>
            <p>{parsedClasses.join(", ")}</p>
          </div>
          <div className="mt-4 w-full">
            <h3 className="text-xl font-semibold">Subjects for Tutoring</h3>
            <p>{tutor.subjects}</p>
          </div>
          <div className="mt-4 w-full">
            <h3 className="text-xl font-semibold">Years of experience</h3>
            <p>{tutor.experience}</p>
          </div>
          <div className="mt-4 w-full">
            <h3 className="text-xl font-semibold">Hourly Rate</h3>
            <p>{tutor.hourlyRate}</p>
          </div>

          <div className="mt-4 w-full">
            <h3 className="text-xl font-semibold">Syllabus</h3>
            <p>{parsedSyllabus.join(", ")}</p>
          </div>
        </>
      )}
    </Card>
  </div>
);
};

export default TutorProfile;
