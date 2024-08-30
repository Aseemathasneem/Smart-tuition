import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Label, TextInput } from 'flowbite-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBookedSlots, cancelSession, updateSession } from '../../redux/tutor/tutorSlice';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext'; // Adjust the import path according to your project structure

const BookedSlots = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bookedSlots, loading, error, currentUser } = useSelector((state) => state.tutor);
  const showToast = useToast(); // Get the showToast function from the context

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editSlotData, setEditSlotData] = useState({
    sessionId: '',
    date: '',
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    if (currentUser && currentUser._id) {
      dispatch(fetchBookedSlots(currentUser._id));
    }
  }, [dispatch, currentUser]);

  const handleStartSession = (sessionId, studentId, tutorId) => {
    navigate(`/tutor/session/${sessionId}`, {
      state: { studentId, tutorId }
    });
  };

  const handleCancelSession = (sessionId) => {
    dispatch(cancelSession(sessionId))
      .unwrap()
      .then(() => {
        console.log('Session cancelled successfully');
        showToast('Session cancelled successfully', 'success');
      })
      .catch((error) => {
        showToast(error.message || 'Failed to cancel session', 'error');
      });
  };

  const handleRescheduleSession = (slot) => {
    setEditSlotData({
      sessionId: slot._id,
      date: slot.slotId.date,
      startTime: slot.slotId.startTime,
      endTime: slot.slotId.endTime,
      tutorId: currentUser._id
    });
    setIsModalOpen(true);
  };

  const handleModalSubmit = () => {
    console.log('Submitting slot update with data:', editSlotData);
    dispatch(updateSession(editSlotData))
      .unwrap()
      .then(() => {
        showToast('Session rescheduled successfully', 'success');
        setIsModalOpen(false);
      })
      .catch((error) => {
        showToast(error.message || 'Failed to update slot', 'error');
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditSlotData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // Function to check if the session is currently active
  const isSessionActive = (date, startTime, endTime) => {
    const dateOnly = date.split('T')[0]; // '2024-08-28'
    
    // Combine the date with startTime and endTime
    const sessionStartDateTime = new Date(`${dateOnly}T${startTime}:00`);
  const sessionEndDateTime = new Date(`${dateOnly}T${endTime}:00`);
    const currentDateTime = new Date();
  

    
    return currentDateTime >= sessionStartDateTime && currentDateTime <= sessionEndDateTime;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const sessions = bookedSlots.sessions || [];

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Booked Slots</h2>
      {sessions.length === 0 ? (
        <p className="text-lg text-gray-900 dark:text-gray-100">Currently no booked slots.</p>
      ) : (
        <>
          <Table>
            <Table.Head>
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell>Student Name</Table.HeadCell>
              <Table.HeadCell>Start Time</Table.HeadCell>
              <Table.HeadCell>End Time</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {sessions.map((slot) => (
                <Table.Row key={slot._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{formatDate(slot.slotId.date)}</Table.Cell>
                  <Table.Cell>{slot.studentId.name}</Table.Cell>
                  <Table.Cell>{slot.slotId.startTime}</Table.Cell>
                  <Table.Cell>{slot.slotId.endTime}</Table.Cell>
                  <Table.Cell>
                    <div className="flex space-x-2">
                      <Button
                        gradientDuoTone="greenToBlue"
                        onClick={() => handleStartSession(slot._id, slot.studentId._id, currentUser._id)}
                        disabled={!isSessionActive(slot.slotId.date, slot.slotId.startTime, slot.slotId.endTime)}
                      >
                        Start Session
                      </Button>
                      <Button
                        gradientDuoTone="pinkToOrange"
                        onClick={() => handleCancelSession(slot._id)}
                      >
                        Cancel Session
                      </Button>
                      <Button
                        gradientDuoTone="purpleToBlue"
                        onClick={() => handleRescheduleSession(slot)}
                      >
                        Reschedule
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </>
      )}

      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header>
          Reschedule Session
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-4">
              <Label htmlFor="date">Date</Label>
              <TextInput
                id="date"
                type="date"
                name="date"
                value={editSlotData.date}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="startTime">Start Time</Label>
              <TextInput
                id="startTime"
                type="time"
                name="startTime"
                value={editSlotData.startTime}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="endTime">End Time</Label>
              <TextInput
                id="endTime"
                type="time"
                name="endTime"
                value={editSlotData.endTime}
                onChange={handleInputChange}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleModalSubmit}>
            Save Changes
          </Button>
          <Button color="gray" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BookedSlots;

// Utility function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
