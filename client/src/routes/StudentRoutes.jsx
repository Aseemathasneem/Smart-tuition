import React from 'react';
import { Routes, Route } from 'react-router-dom';

import StudentSignIn from '../pages/student/studentSignIn';
import StudentSignUp from '../pages/student/studentSignUp';
// import StudentProfile from '../pages/student/StudentProfile';
import StudentOtpVerification from '../pages/student/studentOtpVerification';
import PrivateRoute from '../pages/student/StudentPrivateRoutes'
import TutorList from '../pages/student/TutorList';
import StudentHome from '../pages/student/studentHome'
import TutorDetails from '../pages/student/TutorDetails';
import PaymentSummary from '../pages/student/PaymentSummary';
import Success from '../pages/student/success';
import Cancel from '../pages/student/cancel';
import StudentSession from '../pages/student/StudentSession';

import StudentBookedSessions from '../pages/student/BookedSessions';
import StudentNotifications from '../pages/student/Studentnotifications';
import StudentAssignments from '../pages/student/StudentAssignments';


const StudentRoutes = () => (
 
  <Routes>
   
    <Route path="sign-in" element={<StudentSignIn />} />
    <Route path="sign-up" element={<StudentSignUp />} />
    <Route path="otp-verification" element={<StudentOtpVerification />} />
    <Route path="home" element={<StudentHome />} />
    <Route element={<PrivateRoute />}>
      
      <Route path="approved-tutors" element={<TutorList />} />
      <Route path="tutor_details/:tutorId" element={<TutorDetails />} />
      <Route path="/payment-summary" element={<PaymentSummary />} />
      <Route path="/payment-success" element={<Success />} />
      <Route path="/payment-cancel" element={<Cancel />} />
      <Route path="booked_sessions" element={<StudentBookedSessions/>} />
      <Route path="notifications" element={<StudentNotifications/>} />
      <Route path="session/:sessionId" element={<StudentSession />} />
      <Route path="assignments" element={<StudentAssignments />} />
      
  </Route>
  
  </Routes>
 
);

export default StudentRoutes;
