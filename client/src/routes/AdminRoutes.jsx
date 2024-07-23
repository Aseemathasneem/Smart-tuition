// AdminRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminSignIn from '../pages/admin/AdminSignIn';
import AdminSignUp from '../pages/admin/AdminSignUp';
import AdminOtpVerification from '../pages/admin/AdminOtpVerification';
import PrivateRoutes from '../pages/admin/AdminPrivateRoute';
import StudentsList from '../pages/admin/StudentsLists';
import TutorsList from '../pages/admin/TutorsList';
import ApprovalList from '../pages/admin/ApprovalList';
import AdminLayout from '../layouts/AdminLayout';
import Subjectslists from '../pages/admin/SubjectsLists';

const AdminRoutes = () => (
  <Routes>
    <Route path="sign-in" element={<AdminSignIn />} />
    <Route path="sign-up" element={<AdminSignUp />} />
    <Route path="otp-verification" element={<AdminOtpVerification />} />
    <Route element={<PrivateRoutes />}>
      <Route element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="students" element={<StudentsList />} />
        <Route path="tutors" element={<TutorsList />} />
        <Route path="approvals" element={<ApprovalList />} />
        <Route path="subjects" element={<Subjectslists />} />
       
      </Route>
    </Route>
  </Routes>
);

export default AdminRoutes;
