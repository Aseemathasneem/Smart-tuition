import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TutorDashboard from '../pages/tutor/TutorDashboard';
import TutorSignIn from '../pages/tutor/TutorSignIn';
import TutorSignUp from '../pages/tutor/TutorSignUp';


import TutorOtpVerification from '../pages/tutor/TutorOtpVerification';
import PrivateRoutes from '../pages/tutor/TutorPrivateRoute';
import TutorHome from '../pages/tutor/TutorHome';
import TutorSession from '../pages/tutor/TutorSession'
import TutorNotifications from '../pages/tutor/TutorNotifications';

const TutorRoutes = () => (
  <Routes>
  <Route path="sign-in" element={<TutorSignIn />} />
  <Route path="sign-up" element={<TutorSignUp />} />
  <Route path="otp-verification" element={<TutorOtpVerification />} />
  <Route path="home" element={<TutorHome />} />
  
  <Route element={<PrivateRoutes />}>
      <Route path="dashboard" element={<TutorDashboard />} />
      <Route path="session/:sessionId" element={<TutorSession />} />
      <Route path="notifications" element={<TutorNotifications/>} />
  </Route>
</Routes>
);

export default TutorRoutes;
