import React from 'react';
import RevenueCard from './RevenueCard';

const DashboardContent = () => (
  <>
    <DashboardSummary />
    <RecentActivities />
    <RevenueCard />
  </>
);

const DashboardSummary = () => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <h2 className="text-2xl font-semibold mb-4">Dashboard Overview</h2>
    <p className="text-lg">Welcome to your dashboard! Here you can manage your profile, view your schedule, and track your assignments.</p>
    {/* You can add more summary details or widgets here */}
  </div>
);

const RecentActivities = () => (
  <div className="bg-white p-4 rounded-lg shadow-md mt-4">
    <h2 className="text-2xl font-semibold mb-4">Recent Activities</h2>
    <ul>
      <li>Activity 1: Updated profile</li>
      <li>Activity 2: New assignment posted</li>
      <li>Activity 3: Upcoming class scheduled</li>
      {/* Add more recent activities here */}
    </ul>
  </div>
);


export default DashboardContent;
