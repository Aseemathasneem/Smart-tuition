import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminSignIn from '../pages/admin/AdminSignIn';
import AdminSignUp from '../pages/admin/AdminSignUp';

import AdminOtpVerification from '../pages/admin/AdminOtpVerification';
import PrivateRoute from '../components/PrivateRoute'; 

const AdminRoutes = () => (
  <Routes>
    <Route path="sign-in" element={< AdminSignIn/>} />
    <Route path="sign-up" element={<AdminSignUp />} />
    <Route path="otp-verification" element={<AdminOtpVerification />} />
    <Route element={<PrivateRoute />}>
      <Route path="dashboard" element={< AdminDashboard/>} />
      
    </Route>
  </Routes>
);

export default AdminRoutes;
