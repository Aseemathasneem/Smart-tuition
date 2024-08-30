// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/common/Home';
import StudentLayout from './layouts/StudentLayout';
import TutorLayout from './layouts/TutorLayout';
import AdminRoutes from './routes/AdminRoutes';
import StudentRoutes from './routes/StudentRoutes';
import TutorRoutes from './routes/TutorRoutes';
import CommonLayout from './layouts/CommonLayout';
import BlockedError from './components/BlockedError';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<CommonLayout><Home /></CommonLayout>} />
        <Route path="/student/*" element={<StudentLayout><StudentRoutes /> </StudentLayout>}></Route>
        <Route path="/tutor/*" element={<TutorLayout><TutorRoutes /></TutorLayout> }></Route>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/blocked" element={< BlockedError/>} />
      </Routes>
    </BrowserRouter>
  );
}
