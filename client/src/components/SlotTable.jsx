// SlotTable.js
import React from "react";
import { Button } from "flowbite-react";

const SlotTable = ({ slots, onBookSlot, booked = false }) => {
  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold">{booked ? "Booked Slots" : "Available Slots"}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Time
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                End Time
              </th>
              {!booked && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {slots.map((slot, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(slot.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{slot.startTime}</td>
                <td className="px-6 py-4 whitespace-nowrap">{slot.endTime}</td>
                {!booked && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button onClick={() => onBookSlot(slot)} color="blue" className="ml-4 px-2 py-0.5 rounded-md">
                      Book Slot
                    </Button>
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
