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
    <Route path="/student/sign-in" element={<StudentSignIn />} />
    <Route path="/student/sign-up" element={<StudentSignUp />} />
    <Route path="/student/otp-verification" element={<StudentOtpVerification />} />
    <Route element={<PrivateRoute />}>
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      {/* <Route path="/student/profile" element={<StudentProfile />} /> */}
    </Route>
  </Routes>
);

export default StudentRoutes;
