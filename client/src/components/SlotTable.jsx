import React from "react";
import GradientButton from "./GradientButton";

const SlotTable = ({ slots, onBookSlot, booked = false }) => {
  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold">{booked ? "Booked Slots" : "Available Slots"}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Start Time
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                End Time
              </th>
              {!booked && (
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {slots.map((slot, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatDate(slot.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatTime(slot.startTime)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatTime(slot.endTime)}
                </td>
                {!booked && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <GradientButton
                      onClick={() => onBookSlot(slot)}
                     >
                      Book Slot
                    </GradientButton>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SlotTable;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatTime = (timeString) => {
  const [hour, minute] = timeString.split(":");
  const hours = parseInt(hour);
  const minutes = parseInt(minute);

  const period = hours >= 12 ? "PM" : "AM";
  const formattedHour = hours % 12 || 12; // Convert 0 to 12 for midnight
  const formattedMinute = minutes.toString().padStart(2, "0");

  return `${formattedHour}:${formattedMinute} ${period}`;
};

