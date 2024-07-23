import React, { useEffect } from 'react';
import { Table, Button } from 'flowbite-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBookedSlots } from '../../redux/tutor/tutorSlice'; 
import { useNavigate } from 'react-router-dom';

const BookedSlots = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bookedSlots, loading, error, currentUser } = useSelector((state) => state.tutor); 
  
  useEffect(() => {
    if (currentUser && currentUser._id) {
      dispatch(fetchBookedSlots(currentUser._id)); 
    }
  }, [dispatch, currentUser]);

  const handleStartSession = (slotId) => {
    navigate(`/tutor/session/${slotId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Booked Slots</h2>
      {bookedSlots.length === 0 ? (
        <p className="text-lg text-gray-900 dark:text-gray-100">Currently no booked slots.</p>
      ) : (
        <Table>
          <Table.Head>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Student Name</Table.HeadCell>
            <Table.HeadCell>Start Time</Table.HeadCell>
            <Table.HeadCell>End Time</Table.HeadCell>
            <Table.HeadCell>Action</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {bookedSlots.map((slot) => (
              <Table.Row key={slot._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>{new Date(slot.date).toLocaleDateString()}</Table.Cell>
                <Table.Cell>{slot.studentId.name}</Table.Cell>
                <Table.Cell>{slot.startTime}</Table.Cell>
                <Table.Cell>{slot.endTime}</Table.Cell>
                <Table.Cell>
                  <Button gradientDuoTone="greenToBlue" onClick={() => handleStartSession(slot._id)}>
                    Start Session
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </div>
  );
};

export default BookedSlots;
