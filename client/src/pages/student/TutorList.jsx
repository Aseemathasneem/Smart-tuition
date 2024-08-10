import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchTutors } from '../../redux/tutor/tutorSlice';
import { TextInput, Button } from 'flowbite-react'; 
import GradientButton from '../../components/GradientButton';

const TutorsList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tutors, loading, error } = useSelector((state) => state.tutor);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchTutors());
  }, [dispatch]);

  const filteredTutors = tutors.filter(tutor =>
    tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutor.classes.some(cls => cls.toLowerCase().includes(searchTerm.toLowerCase())) ||
    tutor.subjects.some(sub => sub.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleViewDetails = (tutorId) => {
    navigate(`/student/tutor_details/${tutorId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!filteredTutors.length) return <div>No tutors found.</div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-200">
      <div className="container mx-auto py-10 px-4">
        <div className="my-2 flex justify-center">
          <TextInput
            type="text"
            placeholder="Find Tutor"
            className="w-1/2 dark:bg-gray-800 dark:text-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <GradientButton className="ml-2">Search</GradientButton>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutors.map((tutor) => (
            <div key={tutor._id} className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4 h-full">
              <img src={tutor.profilePicture} alt={`${tutor.name}'s profile`} className="h-32 w-32 mx-auto rounded-full" />
              <h3 className="text-xl font-semibold mt-4">{tutor.name}</h3>
              <p className="text-sm mt-2"><strong></strong> {tutor.bio}</p>
              <p className="text-sm mt-2"><strong>Classes:</strong> {tutor.classes.join(', ')}</p>
              <p className="text-sm mt-2"><strong>Subjects:</strong> {tutor.subjects.join(', ')}</p>
              <GradientButton className="mt-4 w-full" onClick={() => handleViewDetails(tutor._id)}>View Details</GradientButton>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TutorsList;
