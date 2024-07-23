import React, { useState, useEffect } from 'react';
import { apiCall } from '../../api/apiCalls';
import endpoints from '../../api/endpoints';
import { Card } from 'flowbite-react';


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

  return (
    <div className="flex justify-center items-center min-h-screen p-3 w-full">
      <Card className="max-w-3xl w-full">
        {tutor && (
          <>
            <div className="flex flex-col items-center">
              <img src={tutor.profilePicture} alt="Profile" className="h-24 w-24 rounded-full mb-4" />
              
              <h2 className="text-2xl font-bold mt-2">{tutor.name}</h2>
              <p className="text-sm">{tutor.email}</p>
              <p className="text-sm font-bold">{`Status: ${tutor.status}`}</p>
              
            </div>
            <div className="mt-6 w-full">
            <p className="text-gray-500  text-center">{tutor.bio}</p>
              <h3 className="text-xl font-semibold">Qualification</h3>
              <p>{tutor.qualification}</p>
            </div>
            <div className="mt-4 w-full">
              <h3 className="text-xl font-semibold">Classes for Tutoring</h3>
              <p>{tutor.classes.join(', ')}</p>
            </div>
            <div className="mt-4 w-full">
              <h3 className="text-xl font-semibold">Subjects for Tutoring</h3>
              <p>{tutor.subjects.join(', ')}</p>
            </div>
            <div className="mt-4 w-full">
              <h3 className="text-xl font-semibold">Hourly Rate</h3>
              <p>{tutor.hourlyRate}</p>
            </div>
            <div className="mt-4 w-full">
              <h3 className="text-xl font-semibold">Available Time</h3>
              <p>{tutor.availableTime}</p>
            </div>
            <div className="mt-4 w-full">
              <h3 className="text-xl font-semibold">Available Days</h3>
              <p>{tutor.availableDays.join(', ')}</p>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default TutorProfile;
