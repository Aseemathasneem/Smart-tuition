import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchTutors } from '../../redux/tutor/tutorSlice';
import TutorCard from "../../components/TutorCard";
import { FindTutorForm } from "../../components/FindTutorForm";
import { Pagination } from 'flowbite-react';

export default function TutorsList() {
  const dispatch = useDispatch();
  const { tutors, loading, error } = useSelector((state) => state.tutor);
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const tutorsPerPage = 4;

  useEffect(() => {
    dispatch(fetchTutors());
  }, [dispatch]);

  useEffect(() => {
    setFilteredTutors(tutors);
  }, [tutors]);

  const handleFilter = (classInput, subjectInput) => {
    const filtered = tutors.filter(
      (tutor) =>
        tutor.classes.some((cls) =>
          cls.toLowerCase().includes(classInput.toLowerCase())
        ) && tutor.subjects.toLowerCase().includes(subjectInput.toLowerCase())
    );
    setFilteredTutors(filtered);
    setCurrentPage(1); // Reset to the first page after filtering
  };

  const handleSort = (criteria) => {
    setFilteredTutors(sortTutors(criteria, tutors));
    setCurrentPage(1); // Reset to the first page after sorting
  };

  const indexOfLastTutor = currentPage * tutorsPerPage;
  const indexOfFirstTutor = indexOfLastTutor - tutorsPerPage;
  const currentTutors = filteredTutors.slice(indexOfFirstTutor, indexOfLastTutor);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!currentTutors.length) return <div>No tutors found.</div>;

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <FindTutorForm onFilter={handleFilter} />
          <div className="flex items-center space-x-2">
            <label htmlFor="sort" className="text-gray-700 dark:text-gray-300">
              Sort by:
            </label>
            <select
              id="sort"
              className="p-2 border rounded-md"
              onChange={(e) => handleSort(e.target.value)}
            >
              <option value="">Select</option>
              <option value="rating">Rating</option>
              <option value="experience">Experience</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {currentTutors.map((tutor, index) => (
            <TutorCard key={index} tutor={tutor} />
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredTutors.length / tutorsPerPage)}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}

function sortTutors(criteria, tutors) {
  if (criteria === "rating") {
    return [...tutors].sort((a, b) => b.rating - a.rating);
  } else if (criteria === "experience") {
    return [...tutors].sort((a, b) => b.experience - a.experience);
  }
  return tutors;
}
