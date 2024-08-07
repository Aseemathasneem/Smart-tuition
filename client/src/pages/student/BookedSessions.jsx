import React, { useEffect } from 'react';
import { Table, Button } from 'flowbite-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStudentBookedSlots } from '../../redux/student/studentSlice';
import { useNavigate } from 'react-router-dom';

const StudentBookedSessions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bookedSlots, loading, error, currentUser } = useSelector((state) => state.student);

  useEffect(() => {
    if (currentUser && currentUser._id) {
      dispatch(fetchStudentBookedSlots(currentUser._id));
    }
  }, [dispatch, currentUser]);

  const handleJoinSession = (sessionId, tutorId) => {
    navigate(`/student/session/${sessionId}`, { state: { studentId: currentUser._id, tutorId } });
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
            <Table.HeadCell>Tutor Name</Table.HeadCell>
            <Table.HeadCell>Start Time</Table.HeadCell>
            <Table.HeadCell>End Time</Table.HeadCell>
            <Table.HeadCell>Action</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {bookedSlots.map((slot) => (
              <Table.Row key={slot.sessionId} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>{formatDate(slot.date)}</Table.Cell>
                <Table.Cell>{slot.tutorId.name}</Table.Cell>
                <Table.Cell>{slot.startTime}</Table.Cell>
                <Table.Cell>{slot.endTime}</Table.Cell>
                <Table.Cell>
                  <Button gradientDuoTone="greenToBlue" onClick={() => handleJoinSession(slot.sessionId, slot.tutorId._id)}>
                    Join Session
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

export default StudentBookedSessions;
// Utility function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}