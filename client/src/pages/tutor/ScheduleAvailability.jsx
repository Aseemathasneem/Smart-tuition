import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import { Button ,Card} from 'flowbite-react';
import { apiCall } from '../../api/apiCalls';
import endpoints from '../../api/endpoints';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ScheduleAvailability = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('18:00');
  const [availability, setAvailability] = useState([]);
  
  const currentUser = useSelector(state => state.tutor.currentUser);
  const tutorId = currentUser?._id; // Retrieve the tutor ID from the current user
  
  const handleAddAvailability = () => {
    // Validation to check if end time is later than start time
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    if (endHour < startHour || (endHour === startHour && endMinute <= startMinute)) {
      toast.error('End time must be later than start time');
      return;
    }

    setAvailability([
      ...availability,
      { date: startDate, startTime, endTime },
    ]);
  };

  const handleRemoveAvailability = (index) => {
    const newAvailability = availability.filter((_, i) => i !== index);
    setAvailability(newAvailability);
  };

  const handleSaveAvailability = async () => {
    if (availability.length === 0) {
      toast.error('Please add at least one availability slot');
      return;
    }

    try {
      const response = await apiCall('post', endpoints.SAVE_AVAILABILITY, {
         tutorId, // Pass the actual tutor ID
        availability,
      });

      console.log('Availability saved:', response.data);
      toast.success('Availability saved successfully');
    } catch (error) {
      console.error('Error saving availability:', error);
      toast.error('Failed to save availability');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-3 w-full bg-gray-200 dark:bg-gray-900">
      <Card className="max-w-3xl w-full">
        <div className="overflow-y-auto h-screen p-4">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-6 max-w-xl w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Set Schedule Availability</h2>
  
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Select Date:</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className="border rounded-md p-2 w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
  
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Start Time:</label>
              <TimePicker
                onChange={setStartTime}
                value={startTime}
                className="border rounded-md p-2 w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
                clockIcon={null}
                disableClock={true}
              />
            </div>
  
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">End Time:</label>
              <TimePicker
                onChange={setEndTime}
                value={endTime}
                className="border rounded-md p-2 w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
                clockIcon={null}
                disableClock={true}
              />
            </div>
  
            <Button
              onClick={handleAddAvailability}
              
              className="text-white px-4 py-2 rounded-md"
            >
              Add Availability
            </Button>
  
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Your Availabilities:</h3>
              <ul>
                {availability.map((slot, index) => (
                  <li key={index} className="mb-2 flex justify-between items-center text-gray-900 dark:text-white">
                    <span>{`Date: ${slot.date.toLocaleDateString()}, Start: ${slot.startTime}, End: ${slot.endTime}`}</span>
                    <Button
                      onClick={() => handleRemoveAvailability(index)}
                      color="failure"
                      className="ml-4 px-2 py-1 rounded-md"
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
  
            <Button
              onClick={handleSaveAvailability}
              className="text-white px-4 py-2 rounded-md mt-4"
            >
              Save Availability
            </Button>
          </div>
        </div>
      </Card>
      <ToastContainer />
    </div>
  );
};

export default ScheduleAvailability;
