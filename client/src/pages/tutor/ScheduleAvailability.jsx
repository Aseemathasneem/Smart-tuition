import React, { useState } from 'react';
import GradientButton from '../../components/GradientButton'; 
import { useSelector } from 'react-redux';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Button, Card, Modal, Label } from 'flowbite-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { apiCall } from '../../api/apiCalls';
import endpoints from '../../api/endpoints';
import { useToast } from '../../contexts/ToastContext';
import { v4 as uuidv4 } from 'uuid';

const ScheduleAvailability = () => {
  const showToast = useToast();
  const [availability, setAvailability] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const currentUser = useSelector((state) => state.tutor.currentUser);
  const tutorId = currentUser?._id;

  const formatTime = (time) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
  };

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setIsModalOpen(true);
  };

  const handleAddAvailability = () => {
    if (!startTime || !endTime) {
      showToast('Please select both start and end times', 'error');
      return;
    }
  
    if (startTime >= endTime) {
      showToast('Start time must be earlier than end time', 'error');
      return;
    }
  
    // Combine selected date with startTime and endTime for accurate comparison
    const selectedStartDateTime = new Date(selectedDate);
    selectedStartDateTime.setHours(startTime.getHours(), startTime.getMinutes(), startTime.getSeconds());
  
    const selectedEndDateTime = new Date(selectedDate);
    selectedEndDateTime.setHours(endTime.getHours(), endTime.getMinutes(), endTime.getSeconds());
  
    const now = new Date();
  
    if (selectedStartDateTime < now || selectedEndDateTime < now) {
      showToast('Selected date and time must be in the future', 'error');
      return;
    }
  
    const newEvent = {
      id: uuidv4(),
      title: `${formatTime(startTime)} - ${formatTime(endTime)}`,
      start: `${selectedDate}T${formatTime(startTime)}`,
      end: `${selectedDate}T${formatTime(endTime)}`,
      allDay: false,
    };
  
    setAvailability((prevAvailability) => [...prevAvailability, newEvent]);
    setIsModalOpen(false);
  };
  

  const handleEventClick = (info) => {
    if (window.confirm(`Are you sure you want to delete this availability?`)) {
      const newAvailability = availability.filter((event) => event.id !== info.event.id);
      setAvailability(newAvailability);
      showToast('Availability removed successfully', 'success');
    }
  };

  const handleSaveAvailability = async () => {
    if (availability.length === 0) {
      showToast('Please add at least one availability slot', 'error');
      return;
    }

    try {
      const response = await apiCall('post', endpoints.SAVE_AVAILABILITY, {
        tutorId,
        availability,
      });

      console.log('Availability saved:', response.data);
      showToast('Availability saved successfully', 'success');
    } catch (error) {
      console.error('Error saving availability:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save availability';

    // Show error message in the toast
    showToast(`Failed to save availability: ${errorMessage}`, 'error');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-3 w-full bg-gray-200 dark:bg-gray-900">
      <Card className="max-w-3xl w-full">
        <div className="overflow-y-auto h-screen p-4">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-6 max-w-xl w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Set Schedule Availability</h2>
            <div className="mb-4">
              <p className="text-sm mb-2 text-red-500 dark:text-gray-300">
                Click on the calendar to add your available slots. Note: You can only add 1 hour slots 
              </p>
            </div>

            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={availability}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              editable={true}
              selectable={true}
              eventTimeFormat={{
                hour: 'numeric',
                minute: '2-digit',
                meridiem: 'short',
              }}
            />

            <GradientButton
              onClick={handleSaveAvailability}
              className="text-white px-4 py-2 rounded-md mt-4"
            >
              Save Availability
            </GradientButton>
          </div>
        </div>
      </Card>

      {/* Modal for Time Picker */}
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header>Select Time</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <DatePicker
                selected={startTime}
                onChange={(date) => setStartTime(date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Start Time"
                dateFormat="h:mm aa"
                className="w-full mt-2 p-2 border rounded"
              />
            </div>
            <div>
              <Label htmlFor="endTime">End Time</Label>
              <DatePicker
                selected={endTime}
                onChange={(date) => setEndTime(date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="End Time"
                dateFormat="h:mm aa"
                className="w-full mt-2 p-2 border rounded"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleAddAvailability}>Add Availability</Button>
          <Button color="gray" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ScheduleAvailability;

