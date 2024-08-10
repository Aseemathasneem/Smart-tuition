// AdminDashboard.js
import React from 'react';
import AdminRevenueCard from './AdminRevenueCard';

const AdminDashboard = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-5 bg-black">Welcome to Admin Dashboard</h2>
      <div className="p-4">
        <AdminRevenueCard />
      </div>
    </div>
  );
};

export default AdminDashboard;
