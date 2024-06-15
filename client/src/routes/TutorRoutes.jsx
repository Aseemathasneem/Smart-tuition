import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TutorDashboard from '../pages/tutor/TutorDashboard';
import TutorSignIn from '../pages/tutor/TutorSignIn';
import TutorSignUp from '../pages/tutor/TutorSignUp';
import TutorProfile from '../pages/tutor/tutorProfile';

import TutorOtpVerification from '../pages/tutor/TutorOtpVerification';
import PrivateRoute from '../components/PrivateRoute'; 

const TutorRoutes = () => (
  <Routes>
    <Route path="sign-in" element={< TutorSignIn/>} />
    <Route path="sign-up" element={<TutorSignUp />} />
    <Route path="otp-verification" element={<TutorOtpVerification />} />
    <Route element={<PrivateRoute />}>
      <Route path="dashboard" element={< TutorDashboard/>} />
      <Route path="profile" element={< TutorProfile/>} />
      
    </Route>
  </Routes>
);

export default TutorRoutes;
