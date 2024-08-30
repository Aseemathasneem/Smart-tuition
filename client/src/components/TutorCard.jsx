import React from "react";
import { Card, Avatar, Badge } from "flowbite-react";
import GradientButton from "./GradientButton";
import { useNavigate } from "react-router-dom"; // Add this to use the navigate function

const TutorCard = ({ tutor }) => {
  const navigate = useNavigate();

  const handleViewDetails = (tutorId) => {
    navigate(`/student/tutor_details/${tutorId}`);
  };

  const parsedClasses = JSON.parse(tutor?.classes || '[]');
  const parsedSyllabus = JSON.parse(tutor?.syllabus || '[]');
  return (
    <Card className="w-full rounded-lg shadow-md">
      <div className="flex items-center p-4 border-b">
        <Avatar img={tutor.profilePicture} size="xl" />
        <div className="ml-4">
          <h5 className="text-xl font-bold">{tutor.name}</h5>
          <p className="text-gray-600">{tutor.subjects+' Tutor'}</p>
        </div>
        <div className="ml-auto">
          <div className="flex">
            {Array.from({ length: tutor.rating }).map((_, index) => (
              <span key={index} className="text-yellow-500">
                ★
              </span>
            ))}
          </div>
          <Badge color="green" className="mt-2">
            {tutor.experience} years experience
          </Badge>
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-600 line-clamp-2">{tutor.bio}</p>
        <div className="mt-2">
          <span className="text-gray-500 mr-2">
            Classes: {parsedClasses.join(", ")}
          </span>
          <span className="text-gray-500 block">
            Syllabus: {parsedSyllabus.join(", ")}
          </span>
        </div>
      </div>
      <GradientButton onClick={() => handleViewDetails(tutor._id)}>View Profile</GradientButton>
    </Card>
  );
};

export default TutorCard;
