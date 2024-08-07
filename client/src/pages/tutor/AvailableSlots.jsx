import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Label, TextInput } from 'flowbite-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAvailableSlots, deleteSlot, updateSlot } from '../../redux/tutor/tutorSlice';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext'; 
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const AvailableSlots = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showToast = useToast();
  const { availableSlots, loading, error, currentUser } = useSelector((state) => state.tutor);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editSlotData, setEditSlotData] = useState({
    slotId: '',
    date: '',
    startTime: '',
    endTime: '',
  });

  useEffect(() => {
    if (currentUser && currentUser._id) {
      dispatch(fetchAvailableSlots(currentUser._id));
    }
  }, [dispatch, currentUser]);

  const handleEditSlot = (slot) => {
    setEditSlotData({
      slotId: slot._id,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      tutorId: slot.tutorId, 
    });
    setIsModalOpen(true);
  };

  const handleDeleteSlot = (slotId) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this slot?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteSlot(slotId))
          .unwrap()
          .then(() => {
            showToast('Slot deleted successfully', 'success');
          })
          .catch((error) => {
            showToast('Failed to delete slot', 'error');
          });
      }
    });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = () => {
    dispatch(updateSlot(editSlotData))
      .unwrap()
      .then(() => {
        showToast('Slot updated successfully', 'success');
        setIsModalOpen(false);
      })
      .catch((error) => {
        const errorMessage = error.message || 'Failed to update slot';
        showToast(errorMessage, 'error');
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const slots = availableSlots || [];

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">My Available Slots</h2>
      {slots.length === 0 ? (
        <p className="text-lg text-gray-900 dark:text-gray-100">No available slots currently.</p>
      ) : (
        <>
          <Table>
            <Table.Head>
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell>Start Time</Table.HeadCell>
              <Table.HeadCell>End Time</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {slots.map((slot) => (
                <Table.Row key={slot._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{formatDate(slot.date)}</Table.Cell>
                  <Table.Cell>{slot.startTime}</Table.Cell>
                  <Table.Cell>{slot.endTime}</Table.Cell>
                  <Table.Cell>
                    <div className="flex space-x-2">
                      <Button gradientDuoTone="greenToBlue" onClick={() => handleEditSlot(slot)}>
                        Edit Slot
                      </Button>
                      <Button gradientDuoTone="pinkToOrange" onClick={() => handleDeleteSlot(slot._id)}>
                        Delete
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          <Modal show={isModalOpen} onClose={handleModalClose}>
            <Modal.Header>Edit Slot</Modal.Header>
            <Modal.Body>
             <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
             Note: Slot duration should be 1 hour
             </p>
              <form>
                <div className="mb-4">
                  <Label htmlFor="date" value="Date" />
                  <TextInput
                    id="date"
                    type="date"
                    value={editSlotData.date}
                    onChange={(e) => setEditSlotData({ ...editSlotData, date: e.target.value })}
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="startTime" value="Start Time" />
                  <TextInput
                    id="startTime"
                    type="time"
                    value={editSlotData.startTime}
                    onChange={(e) => setEditSlotData({ ...editSlotData, startTime: e.target.value })}
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="endTime" value="End Time" />
                  <TextInput
                    id="endTime"
                    type="time"
                    value={editSlotData.endTime}
                    onChange={(e) => setEditSlotData({ ...editSlotData, endTime: e.target.value })}
                  />
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button gradientDuoTone="greenToBlue" onClick={handleModalSubmit}>
                Save Changes
              </Button>
              <Button gradientDuoTone="pinkToOrange" onClick={handleModalClose}>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </div>
  );
};

export default AvailableSlots;

// Utility function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
