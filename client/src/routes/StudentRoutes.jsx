import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StudentDashboard from '../pages/student/studentDashboard';
import StudentSignIn from '../pages/student/studentSignIn';
import StudentSignUp from '../pages/student/studentSignUp';
// import StudentProfile from '../pages/student/StudentProfile';
import StudentOtpVerification from '../pages/student/studentOtpVerification';
import PrivateRoute from '../components/PrivateRoute'; // Make sure the path is correct

const StudentRoutes = () => (
  <Routes>
    <Route path="sign-in" element={<StudentSignIn />}noCache />
    <Route path="sign-up" element={<StudentSignUp />} />
    <Route path="otp-verification" element={<StudentOtpVerification />} />
    <Route element={<PrivateRoute />}>
      <Route path="dashboard" element={<StudentDashboard />} />
      {/* <Route path="/student/profile" element={<StudentProfile />} /> */}
    </Route>
  </Routes>
);

export default StudentRoutes;
